import { useMutation } from "@tanstack/react-query";
import { signMessageAndLogin } from "../wasm/keplr/client-login";
import { useStargazeClient, useWallet } from "../../@stargazezone/client";
import { useToast } from "./useToast";
import { trpcNextPW } from "../server/utils/trpc";

export const useClientLoginMutation = () => {
  const sgwallet = useWallet();
  const sgclient = useStargazeClient();
  const toast = useToast();
  const utils = trpcNextPW.useContext();
  const claimUserAccountMutation = useMutation(async () => {
    const wallet = await sgwallet.login();
    if (!wallet?.address || !sgclient.client) {
      return;
    }
    const otp = Math.floor(Math.random() * 100_000).toString();
    const ok = await signMessageAndLogin(otp, sgclient.client);

    if (!ok) {
      toast.error("Unauthorized");
    } else {
      toast.success("Logged in!");
    }
    // await utils.users.getUser.invalidate();
    await utils.users.invalidate();
    console.log("invalidate users");
    // utils.users.getUser.invalidate({ address: wallet?.address });
  });
  return claimUserAccountMutation;
};
