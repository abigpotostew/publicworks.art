import { ReactElement, useEffect, useState } from "react";
import MainLayout from "../../src/layout/MainLayout";
import styles from "../../styles/Work.module.scss";
import { Button, Container } from "react-bootstrap";
import { LiveMedia } from "../../src/components/media/LiveMedia";
import { RowThinContainer } from "../../src/components/layout/RowThinContainer";
import { RowSquareContainer } from "../../src/components/layout/RowSquareContainer";
import { NumMinted } from "../../src/components/work/NumMinted";
import { useNftMetadata } from "../../src/hooks/useNftMetadata";
import SpinnerLoading from "../../src/components/loading/Loader";
import { GetStaticProps } from "next";
import { RowWideContainer } from "../../src/components/layout/RowWideContainer";
import { useNumMinted } from "../../src/hooks/useNumMinted";
import { PagedGallery } from "../../src/components/media/PagedGallery";
import Head from "next/head";
import { stores } from "src/store/stores";
import { initializeIfNeeded } from "src/typeorm/datasource";
import { serializeWork } from "src/dbtypes/works/serialize-work";
import config from "src/wasm/config";
import { WorkSerializable } from "src/dbtypes/works/workSerializable";
import { useRouter } from "next/router";
import { FieldControl } from "../../src/components/control/FieldControl";
import { StarsAddressName } from "../../src/components/name/StarsAddressName";
import { normalizeIpfsUri } from "../../src/wasm/metadata";

export async function getStaticPaths() {
  await initializeIfNeeded();
  const { items: works } = await stores().project.getProjects({
    limit: 500,
    offset: 0,
    publishedState: "PUBLISHED",
    includeHidden: true,
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
  return {
    props: {
      work: serializeWork(work),
    },
    revalidate: 10, // In seconds
    // fallback: "blocking",
  };
};
//InferGetStaticPropsType<typeof getStaticProps>
const WorkPage = ({ work }: { work: WorkSerializable }) => {
  const router = useRouter();
  // fetch num tokens
  const {
    data: numMinted,
    error: numMintedError,
    isLoading: numMintedLoading,
  } = useNumMinted(work?.slug);

  const [previewTokenId, setPreviewTokenId] = useState("1");
  useEffect(() => {
    if (!numMinted) {
      return;
    }

    setPreviewTokenId((Math.floor(Math.random() * numMinted) + 1).toString());
  }, [numMinted]);

  const metadata = useNftMetadata({
    sg721: work.sg721,
    tokenId: previewTokenId,
    refresh: false,
  });
  console.log("metadata", metadata);

  // console.log("numMinted", numMinted, numMintedError, numMintedLoading);

  // const tmp = trpcNextPW.works.tmp.useQuery(
  //   { slug: "pizza" },
  //   { refetchInterval: 2000 }
  // );
  // console.log("tmp", tmp.data);

  // const loading = false;
  // const errorMetadata = false;
  return (
    <>
      <Head>
        <title key={"title"}>{`${work.name} - publicworks.art`}</title>
      </Head>
      <div>
        <Container>
          <RowSquareContainer>
            <div
              className={`${styles.align_center} align-self-center`}
              style={{ minHeight: 500 }}
            >
              {metadata.isLoading ? (
                <SpinnerLoading />
              ) : metadata.isError ? (
                <img
                  style={{ maxWidth: 500 }}
                  src={normalizeIpfsUri("ipfs://" + work.coverImageCid)}
                />
              ) : metadata?.data?.animation_url ? (
                <LiveMedia
                  ipfsUrl={metadata?.data?.animation_url}
                  minHeight={500}
                />
              ) : (
                <img
                  style={{ maxWidth: 500 }}
                  src={normalizeIpfsUri("ipfs://" + work.coverImageCid)}
                />
              )}
            </div>
            <div className={"mt-2 text-end"}>
              <a
                onClick={() => {
                  router.push(`/work/${work.slug}/${previewTokenId}`);
                }}
              >
                Showing #{previewTokenId}
              </a>
            </div>
          </RowSquareContainer>
        </Container>
        <Container>
          <RowThinContainer className={`mt-1 ${styles.workHeader}`}>
            <div className={"mt-1"}>
              <div>
                <span className={styles.workTitle}>{work.name + " "}</span>
                <span className={`${styles.workAuthor} ms-2 me-1`}>
                  <StarsAddressName
                    address={work.ownerAddress || work.creator}
                  />
                </span>
                {work.sg721 && work.minter ? (
                  <NumMinted slug={work.slug} minter={work.minter} />
                ) : (
                  <div>Deploy your work to view</div>
                )}
              </div>

              <p className={`mt-2`}>
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
                className={`${styles.workDescription} ${styles.displayLinebreak} `}
              >
                {work.description}
              </div>
              {work.additionalDescription && (
                <>
                  {/*<hr />*/}
                  {/*<div className={`${styles.sectionBreak}`}></div>*/}

                  <div>
                    <h5 className={"mt-4"}>Additional Description</h5>
                    <p
                      className={`${styles.workDescription} ${styles.displayLinebreak}`}
                    >
                      {work.additionalDescription}
                    </p>
                  </div>
                </>
              )}
              {/*<div className={`${styles.sectionBreak}`}></div>*/}
              <h5 className={"mt-4"}>Metadata</h5>
              <div className={`${styles.workAuthorLink}}`}>
                {work.externalLink && (
                  <>
                    <FieldControl name={"External Link"}>
                      {" "}
                      <a
                        href={work.externalLink}
                        rel="noreferrer"
                        target={"_blank"}
                      >
                        {work.externalLink}
                      </a>
                    </FieldControl>
                  </>
                )}
              </div>

              <FieldControl name={"Contract"}>
                {work.sg721 ? (
                  <StarsAddressName address={work.sg721} noShorten={true} />
                ) : null}
              </FieldControl>
              <FieldControl name={"Minter"}>
                {work.minter ? (
                  <StarsAddressName address={work.minter} noShorten={true} />
                ) : null}
              </FieldControl>

              <div className={`${styles.sectionBreak}`}></div>
            </div>
          </RowThinContainer>
        </Container>

        <Container>
          <RowWideContainer className={`${styles.tokensGrid}`}>
            <h2 className={"Margin-T-4"}>Mints</h2>
            {config.testnet ? (
              <div className={"mt-2"}>** Showing Testnet Mints **</div>
            ) : (
              <></>
            )}

            {numMinted === 0 && <SpinnerLoading />}
            {numMinted && !work.sg721 && (
              <div>
                <span>No NFTs minted</span>
              </div>
            )}

            {numMinted && !!work.sg721 && (
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
