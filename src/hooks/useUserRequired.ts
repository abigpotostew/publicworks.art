import { useCallback, useEffect, useState } from "react";
import useUserContext from "src/context/user/useUserContext";
import { useWallet } from "@stargazezone/client";
import { useRouter } from "next/router";

export const useUserRequired = (redirect: string) => {
  const router = useRouter();
  const { user } = useUserContext();
  const sgwallet = useWallet();
  const address = sgwallet?.wallet?.address;

  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const redirectTimer = useCallback(
    (cancelTimer: boolean) => {
      if (!cancelTimer && user.isLoading) {
        return;
      }
      if (cancelTimer && timer) {
        clearTimeout(timer);
      }
      const account = address;
      console.log("redirecting here");
      if (!account) {
        router.push({
          pathname: "/login",
          query: {
            redirect: redirect,
          },
        });
      }
    },
    [redirect, timer, router, user.isLoading, address]
  );
  useEffect(() => {
    if (address) redirectTimer(false);
  }, [redirectTimer, router, user.isLoading, user?.data?.id, address]);

  useEffect(() => {
    const timer = setTimeout(() => redirectTimer(true), 1000);
    setTimer(timer);
    return () => {
      clearTimeout(timer);
    };
  }, [redirectTimer]);
};
