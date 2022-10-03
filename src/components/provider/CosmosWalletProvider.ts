import { createContext, useContext } from "react";
import { ConnectedQueryContract, QueryContract } from "../../wasm/keplr/query";
import config from "../../wasm/config";
import { UseMutateFunction, UseMutationResult } from "@tanstack/react-query";

export interface CosmosWalletProviderData {
  client?: QueryContract;
  onlineClient?: ConnectedQueryContract;
  isConnected: boolean;
  connectWallet: () => Promise<void>;
  loginMutation: UseMutationResult<void, unknown, void, unknown> | undefined;
}

export class CosmosWalletProviderDataClient
  implements CosmosWalletProviderData
{
  client: QueryContract | undefined;
  onlineClient: ConnectedQueryContract | undefined;
  loginMutation: UseMutationResult<void, unknown, void, unknown> | undefined;

  constructor(
    client: QueryContract | undefined,
    queryConnectedClient: ConnectedQueryContract | undefined,
    connectKeplrMutation: UseMutationResult<void, unknown, void, unknown>
  ) {
    this.client = client;
    this.onlineClient = queryConnectedClient;
    this.loginMutation = connectKeplrMutation;
    console.log("in constructor", this);
  }

  async connectWallet(): Promise<void> {
    await this.loginMutation?.mutateAsync();
  }

  get isConnected(): boolean {
    return !!this.client?.isConnected();
  }
}

export const CosmosWalletProviderContext =
  createContext<CosmosWalletProviderData>({
    client: undefined,
    connectWallet(): Promise<void> {
      return Promise.resolve(undefined);
    },
    get isConnected(): boolean {
      return false;
    },
    loginMutation: undefined,
  });

export function useCosmosWallet() {
  const context = useContext(CosmosWalletProviderContext);
  if (context === undefined) {
    throw new Error(
      "useCosmosWallet must be used within a CosmosWalletProviderContext"
    );
  }
  return context;
}
