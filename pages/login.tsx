import { ReactElement, useState } from "react";
import MainLayout from "../src/layout/MainLayout";
import { Container } from "react-bootstrap";
import { useRouter } from "next/router";
import { ButtonPW } from "src/components/button/Button";
import { getCookie } from "src/util/cookie";
import { RowThinContainer } from "src/components/layout/RowThinContainer";
import { useStargazeClient, useWallet } from "@stargazezone/client";
import useUserContext from "src/context/user/useUserContext";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "src/hooks/useToast";
import { signMessageAndLogin } from "src/wasm/keplr/client-login";
import { trpcNextPW } from "src/server/utils/trpc";

const AuthPage = () => {
  const router = useRouter();
  const { query } = router;
  const { user } = useUserContext();
  const sgwallet = useWallet();
  const sgclient = useStargazeClient();
  const toast = useToast();
  const [message, setMessage] = useState<string | null>(null);
  const utils = trpcNextPW.useContext();
  const claimUserAccountMutation = useMutation(async () => {
    await sgwallet.login();
    if (!sgwallet.wallet?.address || !sgclient.client) {
      console.log("shortcircuit");
      return;
    }
    const otp = Math.floor(Math.random() * 100_000).toString();
    const ok = await signMessageAndLogin(otp, sgclient.client);

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

    console.log("loginPw end");

    console.log("after pw login");
  });

  const onLogin = async () => {
    try {
      await claimUserAccountMutation.mutateAsync();
      utils.users.getUser.invalidate();
      const token = getCookie("PWToken");
      console.log("here after login");
      if (typeof query.redirect === "string") {
        console.log("redirecting to ", query.redirect);
        await router.push({
          pathname: query.redirect,
        });
      }
    } catch (e) {
      setMessage("Unauthorized");
    }

    //call backend auth with token
  };
  return (
    <>
      <div>
        <Container>
          <RowThinContainer>
            <h1>Login</h1>
          </RowThinContainer>

          <RowThinContainer>
            {user.isSuccess && <p>You're logged in as {user.data.name}</p>}
            <p>
              After clicking Login, keplr will request a signature from you that
              is used to verify ownership of your wallet.
            </p>
            <ButtonPW onClick={onLogin}>Login</ButtonPW>
            {message && <div>{message}</div>}
          </RowThinContainer>
        </Container>
      </div>
    </>
  );
};

AuthPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout metaTitle={"Auth"}>{page}</MainLayout>;
};

export default AuthPage;
