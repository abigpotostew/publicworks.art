import { ReactElement, useCallback } from "react";
import { RowWideContainer } from "../src/components/layout/RowWideContainer";
import MainLayout from "../src/layout/MainLayout";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import styles from '../../styles/Works.module.css';
import stylesWork from '../../styles/Work.module.css';
import Link from "next/link";
import { work } from "../src/helio";
import { CreateWork } from "../src/components/creatework/CreateWork";


const AuthPage = () => {
  const onLogin = useCallback(()=>{
    //request keplr tokenq
    //set cookie
    //
  },[])
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