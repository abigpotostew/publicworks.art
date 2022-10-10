import {
  AminoTypes,
  createGovAminoConverters,
  createBankAminoConverters,
  createStakingAminoConverters,
  createDistributionAminoConverters,
} from "@cosmjs/stargate";
import {
  SigningCosmWasmClient,
  createWasmAminoConverters,
} from "@cosmjs/cosmwasm-stargate";
import { getKeplrFromWindow } from "@keplr-wallet/stores";
import { gasPrice } from "../config/gas";
import type { ChainInfo } from "@keplr-wallet/types";
import { MsgInitialClaim } from "@stargazefi/api/lib/generated/stargaze/claim/v1beta1/tx";
import { AminoMsg } from "@cosmjs/amino";

interface AminoMsgInitialClaim extends AminoMsg {
  readonly type: "claim/InitialClaim";
  readonly value: {
    readonly sender: string;
  };
}

function createClaimingAminoConverters() {
  return {
    "/publicawesome.stargaze.claim.v1beta1.MsgInitialClaim": {
      aminoType: "claim/InitialClaim",
      toAmino: ({ sender }: MsgInitialClaim): AminoMsgInitialClaim["value"] => {
        return {
          sender: sender,
        };
      },
      fromAmino: ({
        sender,
      }: AminoMsgInitialClaim["value"]): MsgInitialClaim => {
        return {
          sender: sender,
        };
      },
    },
  };
}

export default async function getSigningCosmWasmClient(
  chainInfo: ChainInfo
): Promise<SigningCosmWasmClient | null> {
  if (!chainInfo) {
    throw new Error("No Chain Info provided to connect CosmWasmClient");
  }

  const keplr = await getKeplrFromWindow();

  if (!keplr) {
    throw new Error("Keplr not available.");
  }

  // @ts-ignore
  if (window.keplr) {
    // @ts-ignore
    window.keplr.defaultOptions = {
      sign: {
        preferNoSetFee: true,
      },
    };
  }
  await keplr.experimentalSuggestChain(chainInfo);
  await keplr.enable(chainInfo.chainId);

  // get offline signer for signing txs
  const offlineSigner = await keplr.getOfflineSignerAuto(chainInfo.chainId);

  // make client

  const customAminoTypes = new AminoTypes({
    ...createWasmAminoConverters(),
    ...createGovAminoConverters(),
    ...createBankAminoConverters(),
    ...createStakingAminoConverters("stars"),
    ...createDistributionAminoConverters(),
    ...createClaimingAminoConverters(),
  });

  const client = await SigningCosmWasmClient.connectWithSigner(
    chainInfo.rpc,
    offlineSigner,
    {
      gasPrice,
      aminoTypes: customAminoTypes,
    }
  );

  client.registry.register(
    "/publicawesome.stargaze.claim.v1beta1.MsgInitialClaim",
    MsgInitialClaim
  );

  return client;
}
