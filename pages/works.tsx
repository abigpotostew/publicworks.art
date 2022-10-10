import { Fragment, ReactElement } from "react";
import { RowWideContainer } from "../src/components/layout/RowWideContainer";
import MainLayout from "../src/layout/MainLayout";
import { Card, Col, Container, Row } from "react-bootstrap";
import styles from "../styles/Works.module.scss";
import stylesSpacing from "../styles/Spacing.module.scss";
import stylesWork from "../styles/Work.module.scss";
import Link from "next/link";
import { trpcNextPW } from "../src/server/utils/trpc";
import { WorkSerializable } from "../src/dbtypes/works/workSerializable";
import SpinnerLoading from "../src/components/loading/Loader";
import { usePagination } from "../src/hooks/usePagination";
import { ButtonPW } from "src/components/button/Button";

const GalleryComponent = ({ work }: { work: WorkSerializable }) => {
  const query = trpcNextPW.works.workPreviewImg.useQuery({
    workId: work.id,
  });
  console.log(query.data);
  const w = work;
  return (
    <>
      <Col key={w.sg721}>
        <Link href={"/work/" + w.slug} passHref>
          <Card
            style={{ width: "24rem" }}
            className={`${styles.workCardContainer} `}
          >
            <Card.Img variant="top" src={query.isSuccess ? query.data : ""} />
            <Card.Body>
              <Card.Title className={stylesWork.workSmallTitle}>
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
  const pageCount = 2;
  const pageSize = 6;
  // const pagination = usePagination({ pageSize, pageCount, pageUrl: "/works" });
  // console.log("currentPage", pagination.currentPage);
  const query = trpcNextPW.works.listWorks.useInfiniteQuery(
    {
      limit: 6,
    },
    {
      getPreviousPageParam: (lastPage) => {
        return lastPage.nextCursor;
      },
      getNextPageParam: (lastPage) => {
        // console.log("hsdfdsfsdaasdf", lastPage);
        return lastPage.nextCursor;
      },
    }
  );

  const pages = (query.data?.pages || []).concat([]).reverse();
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
                pages?.map((page, index) => (
                  <Fragment key={page.items[0]?.id || index}>
                    {page.items.map((w) => (
                      <GalleryComponent key={w.id} work={w}></GalleryComponent>
                    ))}
                  </Fragment>
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

            <Container
              fluid
              className={stylesSpacing.sectionGap}
              style={{
                paddingTop: "$spacer",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <ButtonPW
                onClick={() => query.fetchPreviousPage()}
                disabled={!query.hasNextPage || query.isFetchingNextPage}
              >
                {query.isFetchingNextPage
                  ? "Loading more..."
                  : query.hasNextPage
                  ? "Load More"
                  : "Nothing more to load"}
              </ButtonPW>
            </Container>
            {/*{[work].map((w) => {*/}
            {/*  return (*/}
            {/*    <p key={w.sg721}>{w.title}</p>*/}
            {/*  )*/}
            {/*})}*/}

            {/*<PaginationComp*/}
            {/*  pages={pagination.pages}*/}
            {/*  page={pagination.currentPage}*/}
            {/*  changePage={pagination.changePage}*/}
            {/*  pagesToRender={pagination.pagesToRender}*/}
            {/*></PaginationComp>*/}
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
