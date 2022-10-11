import { ReactElement } from "react";
import MainLayout from "../../../src/layout/MainLayout";
import styles from "../../../styles/Work.module.scss";
import { Button, Container } from "react-bootstrap";
import { LiveMedia } from "../../../src/components/media/LiveMedia";
import { RowThinContainer } from "../../../src/components/layout/RowThinContainer";
import { RowSquareContainer } from "../../../src/components/layout/RowSquareContainer";
import { NumMinted } from "../../../src/components/work/NumMinted";
import { useNftMetadata } from "../../../src/hooks/useNftMetadata";
import SpinnerLoading from "../../../src/components/loading/Loader";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { RowWideContainer } from "../../../src/components/layout/RowWideContainer";
import { useNumMinted } from "../../../src/hooks/useNumMinted";
import { PagedGallery } from "../../../src/components/media/PagedGallery";
import { work } from "../../../src/helio";
import Head from "next/head";
import { stores } from "src/store/stores";
import { initializeIfNeeded } from "src/typeorm/datasource";
import { serializeWork } from "src/dbtypes/works/serialize-work";
import config from "src/wasm/config";

export async function getStaticPaths() {
  await initializeIfNeeded();
  const { items: works } = await stores().project.getProjects({
    limit: 500,
    offset: 0,
    publishedState: "PUBLISHED",
  });
  // const static = [work];
  return {
    paths: works.map((s) => {
      return { params: { slug: s.slug } };
    }),
    fallback: "blocking",
  };
}

export const getStaticProps: GetStaticProps = async (context) => {
  const slug = context.params?.slug;
  if (typeof slug !== "string") {
    return {
      notFound: true,
    };
  }
  await initializeIfNeeded();
  const work = await stores().project.getProjectBySlug(slug);
  // if (slug !== "helio") {
  //   return {
  //     notFound: true,
  //   };
  // }
  if (!work) {
    return {
      notFound: true,
    };
  }
  // let metadata: NftMetadata | null = null;
  // try {
  //   metadata = await getTokenMetadata(work.sg721, "1");
  // } catch (e) {
  //   //
  // }
  // console.log("work here ", work, metadata);
  return {
    props: {
      work: serializeWork(work),
    },
    revalidate: 10, // In seconds
    // fallback: "blocking",
  };
};

const WorkPage = ({ work }: InferGetStaticPropsType<typeof getStaticProps>) => {
  // fetch num tokens
  const {
    numMinted,
    error: numMintedError,
    loading: numMintedLoading,
  } = useNumMinted(work?.sg721);
  const metadata = useNftMetadata({ sg721: work.sg721, tokenId: "1" });
  // const { collectionSize, error: collectionSizeError, loading: collSizeLoading } = useCollectionSize(work.minter)

  console.log("work", work);
  const loading = false;
  const errorMetadata = false;
  return (
    <>
      <Head>
        <title key={"title"}>{`${work.title} - publicworks.art`}</title>
      </Head>
      <div>
        <Container>
          <RowSquareContainer>
            <div
              className={`${styles.align_center} align-self-center`}
              style={{ minHeight: 500 }}
            >
              {loading ? (
                <SpinnerLoading />
              ) : errorMetadata ? (
                <div>Something went wrong</div>
              ) : (
                <LiveMedia
                  ipfsUrl={
                    metadata?.metadata?.animation_url || work.preview_url
                  }
                  minHeight={500}
                />
              )}
            </div>
          </RowSquareContainer>
        </Container>
        <Container>
          <RowThinContainer
            className={`${styles.paddingTop} ${styles.workHeader}`}
          >
            <div className={styles.paddingTop}>
              <div>
                <span className={styles.workTitle}>{work.name}</span>
                <span className={styles.workAuthor}>
                  {" - " + work.creator}
                </span>
                <NumMinted sg721={work.sg721} minter={work.minter} />
              </div>

              {work.testnet ? <div>** Showing Testnet Mints **</div> : <></>}

              <p className={`${styles.sectionBreak}`}>
                <a
                  className={"btn"}
                  href={`${config.launchpadUrl}/` + work.minter}
                  rel="noreferrer"
                  target={"_blank"}
                >
                  <Button>Mint on stargaze.zone</Button>
                </a>
              </p>

              <div
                className={`${styles.workDescription} ${styles.displayLinebreak} ${styles.sectionBreak}`}
              >
                {work.description}
              </div>
              <hr />
              <div>
                <p>Additional Description:</p>
                <p>
                  {work.slug === "helio" &&
                    `Helio has 9 traits derived from over 23 internal parameters including 20 color palettes of varying rarity that ultimately produce unique animations.`}
                </p>
              </div>
              <hr />
              <div
                className={`${styles.workAuthorLink} ${styles.sectionBreak}`}
              >
                {"External Link: "}
                <a href={work.externalLink} rel="noreferrer" target={"_blank"}>
                  {work.externalLink}
                </a>
              </div>
              <div className={`${styles.sectionBreak}`}></div>
            </div>
          </RowThinContainer>
        </Container>

        <Container>
          <RowWideContainer className={`${styles.tokensGrid}`}>
            {numMinted === 0 && <SpinnerLoading />}
            {numMinted && (
              <PagedGallery
                slug={work.slug}
                sg721={work.sg721}
                totalNumTokens={numMinted}
              />
            )}
          </RowWideContainer>
        </Container>
      </div>
    </>
  );
};

WorkPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout metaTitle={"publicworks.art"}>{page}</MainLayout>;
};

export default WorkPage;
