import { ReactElement, useCallback, useState } from "react";
import { RowWideContainer } from "src/components/layout/RowWideContainer";
import MainLayout from "../src/layout/MainLayout";
import { Container } from "react-bootstrap";
import { useQueryContract } from "src/hooks/useQueryContract";
import { useRouter } from "next/router";
import { ButtonPW } from "src/components/button/Button";
import { useCosmosWallet } from "src/components/provider/CosmosWalletProvider";
import { getCookie } from "src/util/cookie";
import { RowThinContainer } from "src/components/layout/RowThinContainer";
import { useWallet } from "@stargazezone/client";
import useUserContext from "src/context/user/useUserContext";

const AuthPage = () => {
  const router = useRouter();
  const { query } = router;
  const { user } = useUserContext();
  const sgwallet = useWallet();
  // const { queryClient } = useQueryContract();
  const [message, setMessage] = useState<string | null>(null);
  const onLogin = useCallback(async () => {
    setMessage(null);
    //request keplr tokenq
    //set cookie
    //

    if (!wallet?.loginMutation) {
      return;
    }

    try {
      await wallet.loginMutation.mutateAsync(true);
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
  }, [wallet, router]);
  return (
    <>
      <div>
        <Container>
          <RowThinContainer>
            <h1>Login</h1>
          </RowThinContainer>

          <RowThinContainer>
            {/*<p>*/}
            {/*  While Publicworks.art is in beta, you can only log in to*/}
            {/*  <a href={"https://testnet.publicworks.art/"}>*/}
            {/*    https://testnet.publicworks.art/*/}
            {/*  </a>*/}
            {/*  .*/}
            {/*</p>*/}
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
