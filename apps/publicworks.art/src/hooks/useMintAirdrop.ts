import {
  DeliverTxResponse,
  MsgExecuteContractEncodeObject,
  SigningCosmWasmClient,
} from "@cosmjs/cosmwasm-stargate";
import { trpcNextPW } from "../server/utils/trpc";
import { useMutation } from "@tanstack/react-query";
import { toStars } from "src/wasm/address";
import { useWallet } from "@stargazezone/client";
import useStargazeClient from "@stargazezone/client/react/client/useStargazeClient";
import { useToast } from "src/hooks/useToast";
import { toUtf8 } from "@cosmjs/encoding";
import { MsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { createCoin } from "./useUpdateDutchAuction";
import { toUniqueArray } from "@publicworks/shared-utils/fn";

export interface MintMsg {
  mint_to: {
    recipient: string;
  };
}

const AIRDROP_FEE = createCoin(15);

export type MintTxResult = {
  tokenIds: string[];
  transactionHash: string;
  success: boolean;
  result: DeliverTxResponse;
};
export const toMintTxResult = (result: DeliverTxResponse): MintTxResult => {
  if (result.code !== 0) {
    throw new Error("Transaction failed");
  }

  const resultJson = JSON.parse(result.rawLog || "{}");
  if (!Array.isArray(resultJson)) {
    console.error("resultJson", resultJson);
    throw new Error("resultJson is not an array");
  }
  console.log("resultJson", resultJson);
  const tokenIds: string[] = [];
  for (let i = 0; i < resultJson.length; i++) {
    const wasm = resultJson[i]?.events?.find((e: any) => e.type === "wasm");
    if (!wasm || !Array.isArray(wasm.attributes)) {
      console.log(
        "wasm not found in resultJson or is not an array. Did the transaction fail?"
      );
      continue;
    }
    const eventTokenIds: string[] = wasm.attributes
      .filter((m: any) => m.key === "token_id")
      .map((m: any) => m.value as string);
    tokenIds.push(...eventTokenIds);
  }

  console.log("result.data", result.data);
  console.log("result.tokenIds.all", tokenIds);
  return {
    tokenIds: toUniqueArray(tokenIds),
    transactionHash: result.transactionHash,
    result,
    success: result.code === 0,
  };
};
async function executeMintAirdrop(
  signer: SigningCosmWasmClient,
  address: string,
  recipients: string[],
  minter: string
): Promise<MintTxResult> {
  const account = toStars(address);

  const msgs = recipients
    .map((r) => {
      const tempMsg: MintMsg = {
        mint_to: {
          recipient: r,
        },
      };
      return tempMsg;
    })
    .map((msg) => {
      const executeContractMsg: MsgExecuteContractEncodeObject = {
        typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
        value: MsgExecuteContract.fromPartial({
          sender: account,
          contract: minter,
          msg: toUtf8(JSON.stringify(msg)),
          funds: [AIRDROP_FEE],
        }),
      };
      return executeContractMsg;
    });

  const result = await signer.signAndBroadcast(
    account,
    msgs,
    "auto",
    "airdrop"
  );
  const extracted = toMintTxResult(result);

  return {
    tokenIds: extracted.tokenIds,
    transactionHash: result.transactionHash,
    success: result.code === 0,
    result,
  };
}

export const useMintAirdrop = () => {
  const utils = trpcNextPW.useContext();
  const sgwallet = useWallet();
  const client = useStargazeClient();
  const toast = useToast();

  const mutation = useMutation(
    async ({
      recipients,
      minter,
      slug,
    }: {
      recipients: string[];
      minter: string;
      slug: string;
    }): Promise<void> => {
      if (!sgwallet.wallet) return;

      if (!client.client) {
        throw new Error("missing sg client");
      }
      const signingClient = await client.client.connectSigningClient();
      if (!signingClient) {
        throw new Error("Couldn't connect client");
      }
      try {
        const { tokenIds, transactionHash } = await executeMintAirdrop(
          signingClient,
          sgwallet.wallet.address,
          recipients,
          minter
        );
        toast.txHash(
          "Transaction successful. Click for Explorer",
          transactionHash
        );
        toast.mint("Minted token " + tokenIds[0], slug, tokenIds[0]);
      } catch (e) {
        //
        toast.error("Failed to airdrop: " + (e as any)?.message);
        return;
      }

      return;
    }
  );

  return { mutation };
};
