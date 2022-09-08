import { ReactElement } from "react";
import { RowWideContainer } from "../src/components/layout/RowWideContainer";
import MainLayout from "../src/layout/MainLayout";
import { Card, Col, Container, Row } from "react-bootstrap";
import styles from '../../styles/Works.module.css';
import stylesWork from '../../styles/Work.module.css';
import Link from "next/link";
import { work } from "../src/helio";
import { CreateWork } from "../src/components/creatework/CreateWork";


const WorksPage = () => {
  return (<>
    <div>
      {/* eslint-disable-next-line react/jsx-no-undef */}
      <Container>
        <RowWideContainer>
          <h1>Create Work</h1>
        </RowWideContainer>
        
        <RowWideContainer>
          
          <CreateWork />


        </RowWideContainer>
      </Container>

    </div>
  </>)
}

WorksPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <MainLayout>
      {page}
    </MainLayout>
  );
};

export default WorksPage;