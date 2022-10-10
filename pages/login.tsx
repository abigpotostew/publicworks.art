import { ReactElement, useCallback, useState } from "react";
import { RowWideContainer } from "src/components/layout/RowWideContainer";
import MainLayout from "../src/layout/MainLayout";
import { Container } from "react-bootstrap";
import { useQueryContract } from "src/hooks/useQueryContract";
import { useRouter } from "next/router";
import { ButtonPW } from "src/components/button/Button";
import { useCosmosWallet } from "src/components/provider/CosmosWalletProvider";
import { getCookie } from "src/util/cookie";

const AuthPage = () => {
  const router = useRouter();
  const { query } = router;
  const wallet = useCosmosWallet();
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
          <RowWideContainer>
            <h1>Login</h1>
          </RowWideContainer>

          <RowWideContainer>
            {/*<p>*/}
            {/*  While Publicworks.art is in beta, you can only log in to*/}
            {/*  <a href={"https://testnet.publicworks.art/"}>*/}
            {/*    https://testnet.publicworks.art/*/}
            {/*  </a>*/}
            {/*  .*/}
            {/*</p>*/}
            <ButtonPW onClick={onLogin}>Login</ButtonPW>
            {message && <div>{message}</div>}
          </RowWideContainer>
        </Container>
      </div>
    </>
  );
};

AuthPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout metaTitle={"Auth"}>{page}</MainLayout>;
};

export default AuthPage;
