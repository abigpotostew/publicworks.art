// @flow
import { FC, ReactNode } from "react";
import { trpcNextPW } from "src/server/utils/trpc";
import { useWallet } from "@stargazezone/client";
import UserContext from "./UserContext";

interface Props {
  children: ReactNode;
}

export const UserProvider: FC<Props> = ({ children }: Props) => {
  const sgwallet = useWallet();
  const userCtx = trpcNextPW.users.getUser.useQuery(
    {
      address: sgwallet.wallet?.address,
    },
    { enabled: !!sgwallet.wallet?.address, retry: false }
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
