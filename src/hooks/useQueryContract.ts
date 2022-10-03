import { ConnectedQueryContract, QueryContract } from "../wasm/keplr/query";
import { useEffect, useState } from "react";
import config from "../wasm/config";
import { useMutation } from "@tanstack/react-query";

export const useQueryContract = () => {
  const [queryClient, setQueryClient] = useState<QueryContract | undefined>(
    undefined
  );
  const [queryConnectedClient, setQueryConnectedClient] = useState<
    ConnectedQueryContract | undefined
  >(undefined);

  useEffect(() => {
    (async () => {
      const queryClient = await QueryContract.init(config);
      setQueryClient(queryClient);
    })();
  }, []);

  const connectKeplrMutation = useMutation(async () => {
    //
    if (!queryClient) return;
    const data = await queryClient.connectKeplr();
    const accounts = await data.offlineSigner.getAccounts();
    if (accounts.length < 1) {
      throw new Error("no accounts connected");
    }
    setQueryConnectedClient(
      new ConnectedQueryContract(
        queryClient.config,
        queryClient.cosmosClient,
        data.signer,
        data.offlineSigner,
        accounts
      )
    );
  });

  const logoutMutation = useMutation(async () => {
    //
    console.log("singout mutation");
    if (!queryClient || !queryClient.keplrClient) return;
    console.log("singout mutation disconnet");
    queryClient.keplrClient.disconnect();
    setQueryConnectedClient(undefined);
  });

  return {
    queryClient,
    queryConnectedClient,
    connectKeplrMutation,
    logoutMutation,
  };
};
