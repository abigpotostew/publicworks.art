import { ReactElement, useCallback, useState } from "react";
import { RowWideContainer } from "../src/components/layout/RowWideContainer";
import MainLayout from "../src/layout/MainLayout";
import { Button, Container } from "react-bootstrap";
import { useQueryContract } from "../src/hooks/useQueryContract";
import { useRouter } from "next/router";

const AuthPage = () => {
  const router = useRouter();
  const { query } = router;
  const { queryClient } = useQueryContract();
  const [message, setMessage] = useState<string | null>(null);
  const onLogin = useCallback(async () => {
    setMessage(null);
    //request keplr tokenq
    //set cookie
    //
    if (!queryClient) {
      return;
    }

    await queryClient.connectKeplr();
    const accounts = await queryClient.getAccounts();
    if (accounts.length > 0) {
      // window.location.href = '/share?account=' + accounts[0].address
    }
    const otp = Math.floor(Math.random() * 100_000).toString();
    const ok = await queryClient.signMessage(otp);
    if (!ok) {
      //show an error
      setMessage("Unauthorized");
    } else {
      if (typeof query.redirect === "string") {
        await router.push({
          pathname: query.redirect,
        });
      }
    }

    //call backend auth with token
  }, [queryClient, router]);
  return (
    <>
      <div>
        <Container>
          <RowWideContainer>
            <h1>Login</h1>
          </RowWideContainer>

          <RowWideContainer>
            <p>
              While Publicworks.art is in beta, you can only log in to
              <a href={"https://testnet.publicworks.art/"}>
                https://testnet.publicworks.art/
              </a>
              .
            </p>
            <Button onClick={onLogin}>Login</Button>
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
