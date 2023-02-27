import { OfflineDirectSigner, OfflineSigner } from "@cosmjs/proto-signing";
import {
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

export interface MintMsg {
  mint_to: {
    recipient: string;
  };
}

const client:
  | {
      signer: SigningCosmWasmClient;
      offlineSigner: OfflineSigner | OfflineDirectSigner;
    }
  | undefined = undefined;

const AIRDROP_FEE = {
  amount: (15 * 1000000).toString(),
  denom: "ustars",
};

async function executeMintAirdrop(
  signer: SigningCosmWasmClient,
  address: string,
  recipients: string[],
  minter: string
) {
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
  const resultJson = JSON.parse(result.rawLog || "{}");
  if (!Array.isArray(resultJson)) {
    console.error("resultJson", resultJson);
    throw new Error("resultJson is not an array");
  }
  console.log("resultJson", resultJson);
  const wasm = resultJson[0]?.events?.find((e: any) => e.type === "wasm");
  if (!wasm || !Array.isArray(wasm.attributes)) {
    throw new Error("wasm not found in resultJson or is not an array");
  }
  const tokenId = wasm.attributes.find((m: any) => m.key === "token_id")
    ?.value as string | undefined;
  console.log("result.rawLog", wasm);
  console.log("result.data", result.data);
  console.log("result.tokenId", tokenId);
  return { tokenId: tokenId || "", transactionHash: result.transactionHash };
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
      // let res: { sg721: string; minter: string } | undefined = undefined;
      try {
        const { tokenId, transactionHash } = await executeMintAirdrop(
          signingClient,
          sgwallet.wallet.address,
          recipients,
          minter
        );
        toast.txHash(
          "Transaction successful. Click for Explorer",
          transactionHash
        );
        toast.mint("Minted token " + tokenId, slug, tokenId);
      } catch (e) {
        //
        toast.error("Failed to airdrop on chain: " + (e as any)?.message);
        return;
      }

      return;
    }
  );

  return { mutation };
};
