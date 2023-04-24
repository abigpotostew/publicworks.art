import { ReactElement } from "react";
import MainLayout from "../src/layout/MainLayout";
import { Container } from "react-bootstrap";
import stylesSpacing from "../styles/Spacing.module.scss";
import { trpcNextPW } from "../src/server/utils/trpc";
import SpinnerLoading from "../src/components/loading/Loader";
import { ButtonPW } from "src/components/button/Button";
import { RowThinContainer } from "src/components/layout/RowThinContainer";
import { GetStaticPropsContext } from "next";
import { initializeIfNeeded } from "src/typeorm/datasource";
import { GalleryComponent } from "src/components/gallery/GalleryComponent";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "src/server/routes/_app";
import { Context } from "src/server/context";
import superjson from "superjson";


export async function getStaticProps(context: GetStaticPropsContext) {
  await initializeIfNeeded();

  // console.log("in getStaticProps");
  const ssg = await createProxySSGHelpers({
    router: appRouter,
    ctx: {} as Context,
    transformer: superjson, // optional - adds superjson serialization
  });
  // // const id = context.params?.id as string;
  // // prefetch `post.byId`
  const prefetch = async () => {
    await ssg.works.listWorks.prefetch({
      limit: 100,
      includeHidden: false,
    });
    const works = await ssg.works.listWorks.fetch({
      limit: 100,
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
  const query = trpcNextPW.works.listWorks.useInfiniteQuery(
    {
      limit: 100,
      includeHidden: false,
    },
    {
      getNextPageParam: (lastPage) => {
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
          {query.isLoading && <SpinnerLoading />}
          <RowThinContainer innerClassName="p-4 ">
            {query.isSuccess &&
              pages
                ?.map((page, index) => {
                  return page.items
                    .map((w) => {
                      return (
                        <GalleryComponent
                          key={(page.items[0]?.id || index) + w.id}
                          work={w}
                          className={"Margin-B-4 Margin-T-4"}
                        ></GalleryComponent>
                      );
                    })
                    .flat();
                })
                ?.flat()}

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
