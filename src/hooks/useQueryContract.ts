import { ConnectedQueryContract, QueryContract } from "../wasm/keplr/query";
import { useEffect, useState } from "react";
import config from "../wasm/config";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { deleteCookie, getCookie } from "src/util/cookie";
import { deleteToken, getToken } from "src/util/auth-token";

export const useQueryContract = () => {
  const [queryClient, setQueryClient] = useState<QueryContract | undefined>(
    undefined
  );
  const [queryConnectedClient, setQueryConnectedClient] = useState<
    ConnectedQueryContract | undefined
  >(undefined);

  const connectKeplrMutation = useMutation(async () => {
    //
    console.log("in connect");
    if (!queryClient) return;
    console.log("after in connect");
    const data = await queryClient.connectKeplr();
    const accounts = await data.offlineSigner.getAccounts();
    if (accounts.length < 1) {
      throw new Error("no accounts connected");
    }

    const loginPw = async () => {
      const token = getCookie("PWToken");
      if (!token) {
        const otp = Math.floor(Math.random() * 100_000).toString();
        const ok = await queryClient.signMessage(otp);
        if (!ok) {
          //show an error
          // setMessage("Unauthorized");
          toast.error("Unauthorized");
        } else {
          toast.success("Logged in!");
          // if (typeof query.redirect === "string") {
          //   await router.push({
          //     pathname: query.redirect,
          //   });
          // }
        }
      }
    };
    //this should only happen on the login page
    // await loginPw();

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

  useEffect(() => {
    (async () => {
      if (!queryClient) {
        const queryClient = await QueryContract.init(config);
        setQueryClient(queryClient);
      } else {
        if (getToken()) {
          await connectKeplrMutation.mutateAsync();
        }
      }
    })();
  }, [queryClient]);

  const logoutMutation = useMutation(async () => {
    //
    console.log("singout mutation");
    deleteToken();
    console.log("cookie token deleted");
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
