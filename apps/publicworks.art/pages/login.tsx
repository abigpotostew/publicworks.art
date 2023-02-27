import { ReactElement, useState } from "react";
import MainLayout from "../src/layout/MainLayout";
import { Container } from "react-bootstrap";
import { useRouter } from "next/router";
import { ButtonPW } from "src/components/button/Button";
import { getCookie } from "src/util/cookie";
import { RowThinContainer } from "src/components/layout/RowThinContainer";
import { useStargazeClient, useWallet } from "@stargazezone/client";
import useUserContext from "src/context/user/useUserContext";
import { useToast } from "src/hooks/useToast";
import { trpcNextPW } from "src/server/utils/trpc";
import { getToken } from "src/util/auth-token";
import { useClientLoginMutation } from "../src/hooks/useClientLoginMutation";

const AuthPage = () => {
  const router = useRouter();
  const { query } = router;
  const { user } = useUserContext();
  //console.log({ user });
  const sgwallet = useWallet();
  const sgclient = useStargazeClient();
  const toast = useToast();
  const [message, setMessage] = useState<string | null>(null);
  const utils = trpcNextPW.useContext();
  const claimUserAccountMutation = useClientLoginMutation();

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

  // const onLoginNew = async () => {
  //   try {
  //     if (!sgclient?.client?.wallet || !sgwallet?.wallet?.address) {
  //       throw new Error("yaaa");
  //     }
  //
  //     const nonce = 111;
  //     console.log("sgclient.client.wallet", sgclient.client.wallet);
  //     console.log("window.keplr!.signArbitrary", window.keplr.signArbitrary);
  //
  //     const key = await window.keplr!.getKey(chainInfo.chainId);
  //     const userAddress = key.bech32Address;
  //
  //     const signature: any = await window.keplr!.signArbitrary(
  //       chainInfo.chainId,
  //       sgwallet?.wallet?.address,
  //       JSON.stringify({
  //         title: "PW Login",
  //         description:
  //           "This is a transaction that allows PW to authenticate you with our application.",
  //         nonce: nonce,
  //       })
  //     );
  //     console.log({ signature });
  //   } catch (e) {
  //     setMessage("Fialed to sign: " + e?.message);
  //   }
  //
  //   //call backend auth with token
  // };
  const token = getToken();
  return (
    <>
      <div>
        <Container>
          <RowThinContainer>
            <h1>Login</h1>
          </RowThinContainer>

          <RowThinContainer>
            {token && user.isSuccess && (
              <p>You're logged in as {user.data.name}</p>
            )}
            {(!token || !user.isError) && (
              <>
                <p>Authenticate to claim your account.</p>
                <p>
                  After clicking Login, keplr will request a signature from you
                  that is used to verify ownership of your wallet.
                </p>

                <ButtonPW onClick={onLogin}>Login</ButtonPW>
                {message && <div>{message}</div>}
              </>
            )}
            {/*<ButtonPW onClick={onLoginNew}>SIGN</ButtonPW>*/}
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
