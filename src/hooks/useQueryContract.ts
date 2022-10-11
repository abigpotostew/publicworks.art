import { ConnectedQueryContract, QueryContract } from "../wasm/keplr/query";
import { useEffect, useState } from "react";
import config from "../wasm/config";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { deleteCookie, getCookie } from "src/util/cookie";
import { deleteToken, getToken } from "src/util/auth-token";
import { useToast } from "src/hooks/useToast";

export const useQueryContract = () => {
  const [queryClient, setQueryClient] = useState<QueryContract | undefined>(
    undefined
  );
  const [queryConnectedClient, setQueryConnectedClient] = useState<
    ConnectedQueryContract | undefined
  >(undefined);
  const toast = useToast();

  const claimUserAccountMutation = useMutation(async (loginToPw?: boolean) => {
    const loginPw = async () => {
      const token = getCookie("PWToken");
      console.log("loginPw start");
      if (!token) {
        console.log("not token inner");
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
        console.log("not token end");
      }
      console.log("loginPw end");
    };
    //this should only happen on the login page
    if (loginToPw) await loginPw();

    console.log("after pw login");
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
          await claimUserAccountMutation.mutateAsync(false);
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
    connectKeplrMutation: claimUserAccountMutation,
    logoutMutation,
  };
};
