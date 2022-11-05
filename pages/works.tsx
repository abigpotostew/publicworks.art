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
import { ButtonPW } from "src/components/button/Button";
import { RowThinContainer } from "src/components/layout/RowThinContainer";
import { GetStaticPaths, GetStaticPropsContext } from "next";
import { stores } from "src/store/stores";
import { initializeIfNeeded } from "src/typeorm/datasource";
import superjson from "superjson";
import { appRouter } from "src/server/routes/_app";
import { createProxySSGHelpers } from "@trpc/react/ssg";
import { Context } from "src/server/context";

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
            // style={{ width: "24rem" }}
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

export async function getStaticProps(context: GetStaticPropsContext) {
  await initializeIfNeeded();

  console.log("in getStaticProps");
  const ssg = await createProxySSGHelpers({
    router: appRouter,
    ctx: {} as Context,
    transformer: superjson, // optional - adds superjson serialization
  });
  // const id = context.params?.id as string;
  // prefetch `post.byId`
  await ssg.works.listWorks.prefetch({
    limit: 100,
    cursor: undefined,
  });
  const works = await ssg.works.listWorks.fetch({
    limit: 100,
    cursor: undefined,
  });
  await Promise.all(
    works.items.map((w) => {
      return ssg.works.workPreviewImg.prefetch({ workId: w.id });
    })
  );
  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
    revalidate: 160,
  };
}

const WorksPage = () => {
  // const pagination = usePagination({ pageSize, pageCount, pageUrl: "/works" });
  // console.log("currentPage", pagination.currentPage);
  const query = trpcNextPW.works.listWorks.useInfiniteQuery(
    {
      limit: 100,
    },
    {
      getNextPageParam: (lastPage) => {
        // console.log("hsdfdsfsdaasdf", lastPage);
        return lastPage.nextCursor;
      },
    }
  );

  const pages = query.data?.pages;
  return (
    <Container>
      <>
        <>
          <RowThinContainer>
            <h1>Works</h1>
          </RowThinContainer>
          <RowThinContainer>
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
                onClick={() => query.fetchNextPage()}
                disabled={!query.hasNextPage || query.isFetchingNextPage}
              >
                {query.isLoading || query.isFetchingNextPage
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
          </RowThinContainer>
        </>
      </>
    </Container>
  );
};

WorksPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout metaTitle={"Works"}>{page}</MainLayout>;
};

export default WorksPage;
