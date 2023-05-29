import { useMutation } from "@tanstack/react-query";
import {
  signMessageAndLogin,
  signMessageAndLoginIfNeeded,
} from "../wasm/keplr/client-login";
import { useStargazeClient, useWallet } from "../../@stargazezone/client";
import { useToast } from "./useToast";
import { trpcNextPW } from "../server/utils/trpc";
//
// const loginClient = async () => {
//   //
// }

export const useClientLoginMutation = () => {
  const sgwallet = useWallet();
  const sgclient = useStargazeClient();
  const toast = useToast();
  const utils = trpcNextPW.useContext();
  const claimUserAccountMutation = useMutation(async () => {
    const wallet = await sgwallet.login();
    if (!wallet?.address || !sgclient.client) {
      console.log("no wallet or client. Cannot login");
      return;
    }
    const ok = await signMessageAndLoginIfNeeded(sgclient.client);

    if (ok === false) {
      toast.error("Unauthorized");
    } else if (ok === true) {
      toast.success("Logged in!");
    } else {
      // already logged in
      return;
    }
    // await utils.users.getUser.invalidate();
    await utils.users.invalidate();
    console.log("invalidate users");
    // utils.users.getUser.invalidate({ address: wallet?.address });
  });
  return claimUserAccountMutation;
};
