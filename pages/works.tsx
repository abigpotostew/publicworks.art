import { ReactElement } from "react";
import { RowWideContainer } from "../src/components/layout/RowWideContainer";
import MainLayout from "../src/layout/MainLayout";
import { Card, Col, Container, Row } from "react-bootstrap";
import styles from "../styles/Works.module.css";
import stylesWork from "../styles/Work.module.css";
import Link from "next/link";
import { work } from "../src/helio";
import { trpcNextPW } from "../src/server/utils/trpc";
import SpinnerLoading from "../src/components/loading/Loader";
import { WorkSerializable } from "../src/dbtypes/works/workSerializable";

const GalleryComponent = ({ work }: { work: WorkSerializable }) => {
  const query = trpcNextPW.works.workPreviewImg.useQuery({
    workId: work.id,
  });
  const w = work;
  return (
    <>
      <Col key={w.sg721}>
        <Link href={"/work/" + w.slug} passHref>
          <Card
            style={{ width: "32rem" }}
            className={`${styles.workCardContainer} `}
          >
            <Card.Img variant="top" src={query.isSuccess ? query.data : ""} />
            <Card.Body>
              <Card.Title className={stylesWork.workTitle}>
                {w.name} - {w.creator}
              </Card.Title>
              <Card.Text>{w.blurb}</Card.Text>
            </Card.Body>
          </Card>
        </Link>
      </Col>
    </>
  );
};

const WorksPage = () => {
  const query = trpcNextPW.works.listWorks.useQuery({ limit: 10, offset: 0 });

  return (
    <>
      <div>
        <Container>
          <RowWideContainer>
            <h1>Works</h1>
          </RowWideContainer>
          <RowWideContainer>
            <Row xs={1} md={2} className="g-6">
              {query.isLoading && <SpinnerLoading />}
              {query.isSuccess &&
                query.data.map((w, idx) => (
                  <GalleryComponent key={w.id} work={w}></GalleryComponent>
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
    </>
  );
};

WorksPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout metaTitle={"Works"}>{page}</MainLayout>;
};

export default WorksPage;
