// @flow
import { FC, ReactNode } from "react";
import { trpcNextPW } from "src/server/utils/trpc";
import { useWallet } from "@stargazezone/client";
import UserContext from "./UserContext";
import { getToken } from "../../util/auth-token";
import { useQuery } from "@tanstack/react-query";

interface Props {
  children: ReactNode;
}

const useGetTokenCookie = () => {
  const sgwallet = useWallet();
  const address = sgwallet.wallet?.address;
  return useQuery({
    queryKey: ["gettoken", address],
    queryFn: async () => {
      if (!address) return "";
      return getToken() || "";
    },
    enabled: !!address,
  });
};

export const UserProvider: FC<Props> = ({ children }: Props) => {
  const sgwallet = useWallet();
  const address = sgwallet.wallet?.address;

  const tokenD = useGetTokenCookie();
  const userCtx = trpcNextPW.users.getUser.useQuery(
    {
      address: address,
    },
    {
      enabled: !!tokenD.data && !!sgwallet.wallet?.address,
      // onSuccess: () => {
      //   console.log("userCtx.onSuccess", userCtx.data);
      // },
      // onSettled: () => {
      //   console.log("userCtx.onSettled", userCtx.data);
      // },
    }
  );
  return (
    <UserContext.Provider
      value={{
        user: userCtx,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
