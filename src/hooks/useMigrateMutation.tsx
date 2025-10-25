import { useMutation } from "@tanstack/react-query";
import { useStargazeClient, useWallet } from "../../@stargazezone/client";
import { useToast } from "./useToast";
import config from "../wasm/config";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";

export interface MigrateParams {
  minter: string;
}

const migrate = async (
  client: SigningCosmWasmClient,
  account: string,
  params: MigrateParams
) => {
  const migrateREs = await client.migrate(
    account,
    params.minter,
    config.minterCodeId,
    {},
    "auto"
  );
  console.log("migrate response, ", migrateREs);
  return migrateREs;
};
export const useMigrateMutation = () => {
  const sgwallet = useWallet();
  const { client } = useStargazeClient();
  const toast = useToast();
  const mutation = useMutation({
    mutationFn: async (params: MigrateParams) => {
      try {
        if (!sgwallet.wallet) return;

        if (!client) {
          throw new Error("missing sg client");
        }
        const signingClient = await client.connectSigningClient();
        if (!signingClient) {
          throw new Error("Couldn't connect client");
        }
        const out = await migrate(
          signingClient,
          sgwallet.wallet.address,
          params
        );
        toast.txHash("migrate", out.transactionHash);
      } catch (e) {
        toast.error("failed to migrate: " + (e as unknown as any).message);
      }
    },
  });
  return mutation;
};
