import { WorkSerializable } from "@publicworks/db-typeorm/serializable";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { Timestamp } from "@stargazezone/types/contracts/sg721/shared-types";
import { trpcNextPW } from "../server/utils/trpc";
import { useMutation } from "@tanstack/react-query";
import { toStars } from "src/wasm/address";
import { Coin, useWallet } from "@stargazezone/client";
import useStargazeClient from "@stargazezone/client/react/client/useStargazeClient";
import { useToast } from "src/hooks/useToast";
import { createCoin, createCoinFromNative } from "./useUpdateDutchAuction";
import { MsgExecuteContractEncodeObject, toUtf8 } from "cosmwasm";
import { MsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { toMintTxResult, MintTxResult } from "./useMintAirdrop";

export interface ExecuteMintMsg {
  mint: Record<string, never>;
}

async function executeMint(
  minter: string,
  address: string,
  pricePerTokenNative: string,
  quantity: number,
  client: SigningCosmWasmClient
) {
  if (!minter) {
    throw new Error("work minter invalid");
  }
  const account = toStars(address);

  const msgArray = [];
  for (let i = 0; i < quantity; i++) {
    const msg: ExecuteMintMsg = {
      mint: {},
    };
    const executeContractMsg: MsgExecuteContractEncodeObject = {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: account,
        contract: minter,
        msg: toUtf8(JSON.stringify(msg)),
        funds: [createCoinFromNative(pricePerTokenNative)],
      }),
    };
    msgArray.push(executeContractMsg);
  }

  const result = await client.signAndBroadcast(account, msgArray, "auto", "");
  return toMintTxResult(result);
}

export const useMintMutation = () => {
  const sgwallet = useWallet();
  const client = useStargazeClient();
  const toast = useToast();

  const mutation = useMutation(
    async (opts: {
      minter: string;
      price: string;
      quantity: number;
    }): Promise<MintTxResult> => {
      ///
      if (!sgwallet.wallet) throw new Error("missing wallet");

      if (!opts.minter) throw new Error("missing work");

      if (!client.client) {
        throw new Error("missing sg client");
      }
      const signingClient = await client.client.connectSigningClient();
      if (!signingClient) {
        throw new Error("Couldn't connect client");
      }
      try {
        return executeMint(
          opts.minter,
          sgwallet.wallet.address,
          opts.price,
          opts.quantity,
          signingClient
        );
      } catch (e) {
        toast.error(
          "Failed to configure price on chain: " + (e as any)?.message
        );
        throw e;
      }
    }
  );

  return mutation;
};
