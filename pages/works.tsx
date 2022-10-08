import { ReactElement, useCallback, useMemo, useState } from "react";
import { RowWideContainer } from "../src/components/layout/RowWideContainer";
import MainLayout from "../src/layout/MainLayout";
import { Card, Col, Container, Row } from "react-bootstrap";
import styles from "../styles/Works.module.scss";
import stylesWork from "../styles/Work.module.scss";
import Link from "next/link";
import { work } from "../src/helio";
import { trpcNextPW } from "../src/server/utils/trpc";
import { WorkSerializable } from "../src/dbtypes/works/workSerializable";
import { useRouter } from "next/router";
import SpinnerLoading from "../src/components/loading/Loader";
import { usePagination } from "../src/hooks/usePagination";
import { PaginationComp } from "../src/components/media/PagedGallery";

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
  const pageCount = 100;
  const pageSize = 6;
  const pagination = usePagination({ pageSize, pageCount, pageUrl: "/works" });
  const query = trpcNextPW.works.listWorks.useQuery({
    limit: pageSize,
    offset: pagination.currentPage * pageSize,
  });

  return (
    <Container>
      <>
        <>
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
              {/*{[work].map((w, idx) => (*/}
              {/*  <Col key={w.sg721}>*/}
              {/*    <Link href={"/work/" + w.slug} passHref>*/}
              {/*      <Card*/}
              {/*        style={{ width: "32rem" }}*/}
              {/*        className={`${styles.workCardContainer} `}*/}
              {/*      >*/}
              {/*        <Card.Img variant="top" src={w.previewImgThumb} />*/}
              {/*        <Card.Body>*/}
              {/*          <Card.Title className={stylesWork.workTitle}>*/}
              {/*            {w.title} - {w.author}*/}
              {/*          </Card.Title>*/}
              {/*          <Card.Text>{w.blurb}</Card.Text>*/}
              {/*        </Card.Body>*/}
              {/*      </Card>*/}
              {/*    </Link>*/}
              {/*  </Col>*/}
              {/*))}*/}
            </Row>

            {/*{[work].map((w) => {*/}
            {/*  return (*/}
            {/*    <p key={w.sg721}>{w.title}</p>*/}
            {/*  )*/}
            {/*})}*/}
            <PaginationComp
              pages={pagination.pages}
              page={pagination.currentPage}
              changePage={pagination.changePage}
              pagesToRender={pagination.pagesToRender}
            ></PaginationComp>
          </RowWideContainer>
        </>
      </>
    </Container>
  );
};

WorksPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout metaTitle={"Works"}>{page}</MainLayout>;
};

export default WorksPage;
