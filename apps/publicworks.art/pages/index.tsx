import styles from "../styles/Home.module.scss";
import React, { ReactElement } from "react";
import MainLayout from "../src/layout/MainLayout";
import { Button, Col, Container, Row } from "react-bootstrap";
import SketchAnimation from "../src/components/SketchAnimation";
import Link from "next/link";
import {
  RowLogoContainer,
  RowThinContainer,
} from "../src/components/layout/RowThinContainer";
import { FlexBoxCenter } from "../src/components/layout/FlexBoxCenter";
import { Pill } from "src/components/content/Pill";
import { LogoHeader } from "src/components/logo/LogoHeader";
import { trpcNextPW } from "src/server/utils/trpc";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { appRouter } from "src/server/routes/_app";
import { Context } from "src/server/context";
import superjson from "superjson";
import { ButtonPW } from "src/components/button/Button";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { WorksGalleryComponent } from "../src/components/gallery/WorksGalleryComponent";
import { RowWideContainer } from "../src/components/layout/RowWideContainer";

function GroupDividerBottom() {
  return (
    <div className={styles.groupDividerBottomOnly}>
      <span className={styles.align_center}>• • •</span>
    </div>
  );
}

function GroupDivider() {
  return (
    <Container className={styles.groupDivider}>
      <Row>
        <Col>
          <span className={styles.align_center}>• • •</span>
        </Col>
      </Row>
    </Container>
  );
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const ssg = await createServerSideHelpers({
    router: appRouter,
    ctx: {} as Context,
    transformer: superjson, // optional - adds superjson serialization
  });
  // const id = context.params?.id as string;
  // prefetch `post.byId`
  await ssg.works.listWorks.prefetch({
    limit: 4,
    order: "desc",
    cursor: undefined,
    includeHidden: false,
  });
  const works = await ssg.works.listWorks.fetch({
    limit: 4,
    order: "desc",
    cursor: undefined,
    includeHidden: false,
  });
  await Promise.all(
    works.items.map((w) => {
      return ssg.works.workPreviewImg.prefetch({ workId: w.id });
    })
  );

  // console.log("hello pizza");

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
    revalidate: 60, // In seconds
  };
}

const Home = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const queryWorks = trpcNextPW.works.listWorks.useQuery(
    {
      limit: 4,
      order: "desc",
      cursor: undefined,
      includeHidden: false,
    },
    {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      refetchInterval: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchIntervalInBackground: false,
    }
  );

  let recentWorks;
  if (queryWorks.status !== "success") {
    // won't happen since we're using `fallback: "blocking"`
    recentWorks = <>Loading...</>;
  } else {
    recentWorks = (
      <Container fluid className={"gap-2"}>
        <div
          className={"flex flex-row flex-wrap grid grid-cols-1 xl:grid-cols2"}
        ></div>
        <Row className={"row row-cols-1 row-cols-xl-2 g-4"}>
          {queryWorks.data.items.map((item, index) => {
            return (
              <div key={item.id} className={"col-span-1"}>
                <WorksGalleryComponent work={item}></WorksGalleryComponent>
              </div>
            );
          })}
        </Row>
      </Container>
    );
  }

  return (
    <div>
      <div className={"Margin-T-4 Margin-B-16"}>
        <LogoHeader />
      </div>
      <GroupDividerBottom />

      <Container>
        <RowThinContainer>
          <div className={"text-center"}>
            <h1 className={"text-h1"}>
              Everything you need to create generative art works
            </h1>
          </div>
        </RowThinContainer>
      </Container>
      <RowLogoContainer className={"mt-4 mb-18"}>
        <div className={styles.wrappingFlex}>
          <Pill color={"red"}>🏃‍ Mint on demand</Pill>
          <Pill color={"orange"}>⚙️ Metadata Generation</Pill>
          <Pill color={"yellow"}>🛠 Any Javascript Library</Pill>
          <Pill color={"green"}>🛠 Yes-Code Solution</Pill>
          <Pill color={"teal"}>🌌 WebGL Support</Pill>
          <Pill color={"blue"}>🖼 Canvas</Pill>
          <Pill color={"purple"}>🎧 Web Audio API</Pill>
          <Pill color={"pink"}>💫 Community Voted Project</Pill>
        </div>
      </RowLogoContainer>
      <GroupDividerBottom />

      {/*<Container >*/}
      {/*  <RowThinContainer>*/}
      {/*    <div style={{ textAlign: "center" }}>*/}
      {/*      <p className={`${styles.subdescription} `}>*/}
      {/*        Works are generative tokens that are co-created at mint time. Like*/}
      {/*        Art Blocks, the minter and creator participate in the creation of*/}
      {/*        unique on chain art.*/}
      {/*      </p>*/}
      {/*    </div>*/}
      {/*  </RowThinContainer>*/}
      {/*</Container>*/}
      <Container>
        <RowThinContainer>
          <div className={"fs-2 text-center"}>
            <Link href={"/create"}>
              <ButtonPW className={"me-2 fs-3 border-2"}>Create Work</ButtonPW>
            </Link>
            <Link href={"/docs"}>
              <ButtonPW className={"fs-3"}>Read the Docs</ButtonPW>
            </Link>
          </div>
        </RowThinContainer>
      </Container>

      <GroupDivider />
      <Container>
        <RowWideContainer>
          <div
            className={
              "tw-flex tw-flex-row tw-items-baseline tw-gap-4 Margin-B-4"
            }
          >
            <div
              className={" tw-font-sans tw-text-xl tw-font-title tw-text-4xl"}
            >
              Recent Works
            </div>
            <div>
              {" "}
              <Link
                href={"/works"}
                className={"tw-no-underline hover:tw-underline"}
              >
                See more →
              </Link>
            </div>
          </div>
          {recentWorks}
          {/*{worksList.map((w)=>{return <div key=w.id>{w.name}</div>})}*/}
        </RowWideContainer>
      </Container>

      <GroupDivider />

      <Container>
        <SketchAnimation />
      </Container>
      <GroupDivider />

      <Container fluid>
        <RowThinContainer>
          <FlexBoxCenter
            style={{ justifyContent: "center", alignItems: "center" }}
          >
            <div
              className={styles.subdescription_works_large}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 40,
                textAlign: "center",
              }}
            >
              <div>
                <p>Have thoughts or want to participate?</p>
                <p>Join the discussion</p>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Link href={"https://twitter.com/publicworksart_"}>
                <Button variant={"secondary"}>Twitter</Button>
              </Link>

              <Link
                href={
                  "https://discord.com/channels/755548171941445642/1109506526252642365"
                }
              >
                <Button variant={"secondary"}>Discord</Button>
              </Link>
            </div>
          </FlexBoxCenter>
        </RowThinContainer>
      </Container>
    </div>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Home;
