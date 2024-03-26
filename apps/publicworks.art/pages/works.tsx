import React, { ReactElement } from "react";
import MainLayout from "../src/layout/MainLayout";
import { Col, Container } from "react-bootstrap";
import stylesSpacing from "../styles/Spacing.module.scss";
import { trpcNextPW } from "../src/server/utils/trpc";
import { ButtonPW } from "src/components/button/Button";
import { GetStaticPropsContext } from "next";
import { appRouter } from "src/server/routes/_app";
import { Context } from "src/server/context";
import superjson from "superjson";
import { WorksGalleryComponent } from "../src/components/gallery/WorksGalleryComponent";
import { RowWideContainer } from "../src/components/layout/RowWideContainer";
import { PlaceholderCard } from "../src/components/placeholder/PlaceholderCard";
import { createServerSideHelpers } from "@trpc/react-query/server";

export async function getStaticProps(context: GetStaticPropsContext) {
  const ssg = await createServerSideHelpers({
    router: appRouter,
    ctx: {} as Context,
    transformer: superjson, // optional - adds superjson serialization
  });
  const prefetch = async () => {
    await ssg.works.listWorks.prefetchInfinite({
      order: "desc",
      limit: 100,
      includeHidden: false,
    });
    const works = await ssg.works.listWorks.fetch({
      order: "desc",
      limit: 10,
      includeHidden: false,
    });
    await Promise.all(
      works.items.map((w) => {
        return ssg.works.workPreviewImg.prefetch({ workId: w.id });
      })
    );
  };
  await prefetch();
  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
    revalidate: 160,
  };
}

const WorksPage = () => {
  const [page, setPage] = React.useState(0);
  const query = trpcNextPW.works.listWorks.useInfiniteQuery(
    {
      order: "desc",
      limit: 10,
      includeHidden: false,
    },
    {
      getNextPageParam: (lastPage) => {
        return lastPage.nextCursor;
      },
    }
  );

  const pages = query.data?.pages;
  const loading = query.isLoading;
  return (
    <Container>
      <>
        <>
          <RowWideContainer>
            <h1>Works</h1>
          </RowWideContainer>
          {/*{query.isLoading && <SpinnerLoading />}*/}
          {loading && (
            <RowWideContainer>
              <div className={"row row-cols-1 row-cols-lg-2 g-4 "}>
                <Col>
                  <PlaceholderCard className={"Margin-B-4 Margin-T-4"} />
                </Col>
                <Col>
                  <PlaceholderCard className={"Margin-B-4 Margin-T-4"} />
                </Col>
                <Col>
                  <PlaceholderCard className={"Margin-B-4 Margin-T-4"} />
                </Col>
                <Col>
                  <PlaceholderCard className={"Margin-B-4 Margin-T-4"} />
                </Col>
              </div>
            </RowWideContainer>
          )}
          <RowWideContainer>
            <div className={"row row-cols-1 row-cols-lg-2 g-4"}>
              {query.isSuccess &&
                pages
                  ?.map((page, index) => {
                    return page.items
                      .map((w) => {
                        return (
                          <Col key={w.id}>
                            <WorksGalleryComponent
                              key={(page.items[0]?.id || index) + w.id}
                              work={w}
                              className={"Margin-B-4 Margin-T-4"}
                            ></WorksGalleryComponent>
                          </Col>
                        );
                      })
                      .flat();
                  })
                  ?.flat()}
            </div>
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
                {loading || query.isFetchingNextPage
                  ? "Loading more..."
                  : query.hasNextPage
                  ? "Load More"
                  : "Nothing more to load"}
              </ButtonPW>
            </Container>
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
