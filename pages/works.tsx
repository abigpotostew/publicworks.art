import { ReactElement } from "react";
import { RowWideContainer } from "../src/components/layout/RowWideContainer";
import MainLayout from "../src/layout/MainLayout";
import { Card, Col, Container, Row } from "react-bootstrap";
import styles from '../styles/Works.module.css';
import stylesWork from '../styles/Work.module.css';
import Link from "next/link";
import { work } from "../src/helio";


const WorksPage = () => {


  return (<>
    <div>
      {/* eslint-disable-next-line react/jsx-no-undef */}
      <Container>
        <RowWideContainer>
          <h1>Works</h1>
        </RowWideContainer>
        <RowWideContainer>

          <Row xs={1} md={2} className="g-6">
            {[work].map((w, idx) => (
              <Col key={w.sg721}>
                <Link href={'/work/' + w.slug} passHref>
                
                  <Card style={{ width: '32rem' }} className={`${styles.workCardContainer} `}>
                    <Card.Img variant="top" src={w.previewImgThumb}/>
                    <Card.Body>
                      <Card.Title className={stylesWork.workTitle}>{w.title} - {w.author}</Card.Title>
                      <Card.Text>
                        {w.blurb}
                      </Card.Text>
                    </Card.Body>
                  </Card>

                </Link>
              </Col>
            ))}
          </Row>

          {/*{[work].map((w) => {*/}
          {/*  return (*/}
          {/*    <p key={w.sg721}>{w.title}</p>*/}
          {/*  )*/}
          {/*})}*/}


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