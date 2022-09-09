import { ReactElement, useCallback } from "react";
import { RowWideContainer } from "../src/components/layout/RowWideContainer";
import MainLayout from "../src/layout/MainLayout";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import styles from '../../styles/Works.module.css';
import stylesWork from '../../styles/Work.module.css';
import Link from "next/link";
import { work } from "../src/helio";
import { CreateWork } from "../src/components/creatework/CreateWork";
import { useQueryContract } from "../src/hooks/useQueryContract";


const AuthPage = () => {
  const { queryClient } = useQueryContract()
  const onLogin = useCallback(async ()=>{
    //request keplr tokenq
    //set cookie
    //
    if (!queryClient) {
      return;
    }

    await queryClient.connectKeplr()
    const accounts = await queryClient.getAccounts()
    if (accounts.length > 0) {
      // window.location.href = '/share?account=' + accounts[0].address
    }
    console.log('accounts', accounts)
    const otp = (Math.random()%100_000).toString()
    await queryClient.signMessage(otp)
    console.log("finished logging in")
    //call backend auth with token
  },[queryClient])
  return (<>
    <div>
      {/* eslint-disable-next-line react/jsx-no-undef */}
      <Container>
        <RowWideContainer>
          <h1>Login</h1>
        </RowWideContainer>
        
        <RowWideContainer>
          
          <Button onClick={onLogin}>Login</Button>


        </RowWideContainer>
      </Container>

    </div>
  </>)
}

AuthPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <MainLayout metaTitle={'Auth'}>
      {page}
    </MainLayout>
  );
};

export default AuthPage;