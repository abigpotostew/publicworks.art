import { ReactElement, useState } from "react";
import MainLayout from "../../../src/layout/MainLayout";
import styles from "../../../styles/Work.module.scss";
import { Container } from "react-bootstrap";
import { LiveMedia } from "../../../src/components/media/LiveMedia";
import { RowThinContainer } from "../../../src/components/layout/RowThinContainer";
import { RowSquareContainer } from "../../../src/components/layout/RowSquareContainer";
import { NftMetadata } from "../../../src/hooks/useNftMetadata";
import { getTokenMetadata } from "../../../src/wasm/metadata";
import Link from "next/link";
import Head from "next/head";
import { useTokenOwner } from "../../../src/hooks/useTokenOwner";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { trpcNextPW } from "src/server/utils/trpc";
import SpinnerLoading from "src/components/loading/Loader";
import { Attributes } from "../../../src/components/metadata/Attributes";

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const slug = context.params?.slug;
//   const tokenId = context.params?.tokenId;
//   if (
//     !tokenId ||
//     Array.isArray(tokenId) ||
//     !Number.isFinite(parseInt(tokenId))
//   ) {
//     return {
//       notFound: true,
//     };
//   }
//
//   let metadata: NftMetadata | null = null;
//   const fetchMd = async () => {
//     try {
//       metadata = await getTokenMetadata(
//         work.sg721,
//         tokenId,
//         process.env.NEXT_PUBLIC_IPFS_GATEWAY
//       );
//     } catch (e) {
//       console.warn(`error fetching attempt 2 ${slug} ${tokenId}`, e);
//     }
//   };
//   const [, owner] = await Promise.all([
//     fetchMd(),
//     getTokenOwner(work.sg721, tokenId),
//   ]);
//
//   if (!metadata) {
//     return {
//       notFound: true,
//     };
//   }
//   context.res.setHeader(
//     "Cache-Control",
//     "public, s-maxage=300, stale-while-revalidate=400"
//   );
//
//   return {
//     props: {
//       work,
//       metadata,
//       tokenId,
//       tokenOwner: owner,
//     },
//   };
// };

const WorkTokenPage = () => {
  const router = useRouter();
  const { slug, tokenId } = router.query;
  const [notFound, setNotFound] = useState(false);

  const workQuery = trpcNextPW.works.getWorkBySlug.useQuery(
    { slug: slug?.toString() || "" },
    { enabled: !!slug }
  );
  const { data: work } = workQuery;

  // workQuery?.data?.externalLink

  const tokenMetadata = useQuery(
    ["gettokenmetadata", slug, tokenId, work?.sg721],
    async () => {
      const sg721 = work?.sg721;
      if (!sg721) {
        return;
      }
      if (
        !tokenId ||
        Array.isArray(tokenId) ||
        !Number.isFinite(parseInt(tokenId))
      ) {
        setNotFound(true);
        return;
      }

      // let metadata: NftMetadata | null = null;
      // const fetchMd = async () => {
      //   try {
      //     metadata = await getTokenMetadata(
      //       sg721,
      //       tokenId,
      //       process.env.NEXT_PUBLIC_IPFS_GATEWAY
      //     );
      //   } catch (e) {
      //     console.warn(`error fetching attempt 2 ${slug} ${tokenId}`, e);
      //   }
      // };
      // await fetchMd();
      // // console.log({ metadata });
      //
      // return metadata;
      try {
        return getTokenMetadata(
          sg721,
          tokenId,
          process.env.NEXT_PUBLIC_IPFS_GATEWAY
        );
      } catch (e) {
        return null;
      }
    },
    { enabled: !!work }
  );

  const errorMetadata = tokenMetadata.isError;
  const {
    loading: ownerLoading,
    error,
    owner,
  } = useTokenOwner({ sg721: work?.sg721, tokenId: tokenId?.toString() });

  const notFoundActual =
    (!workQuery.isLoading && !workQuery.isSuccess && !workQuery.data) ||
    notFound;
  return (
    <>
      <Head>
        <title
          key={"title"}
        >{`${workQuery?.data?.name} #${tokenId} - publicworks.art`}</title>
      </Head>
      <div>
        <Container>
          {work ? (
            <Link href={`/work/${work?.slug}`} passHref>
              <span>{`<- Back to ${work?.slug}`}</span>
            </Link>
          ) : (
            <></>
          )}

          <RowSquareContainer>
            <div
              className={`${styles.align_center} align-self-center`}
              style={{ minHeight: 500 }}
            >
              {errorMetadata ? (
                <div>Something went wrong</div>
              ) : notFoundActual ? (
                <div>Not Found</div>
              ) : tokenMetadata.isLoading ? (
                <SpinnerLoading />
              ) : (
                <LiveMedia
                  ipfsUrl={tokenMetadata?.data?.animation_url || ""}
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
                <span className={styles.workTitle}>
                  {workQuery?.data?.name}
                </span>
                <span className={styles.workAuthor}>
                  {" - " + workQuery?.data?.creator}
                </span>
              </div>
              {process.env.NEXT_PUBLIC_TESTNET === "true" ? (
                <div>** Showing Testnet Mints **</div>
              ) : (
                <></>
              )}

              <div
                className={`${styles.workAuthorLink} ${styles.displayLinebreak} ${styles.sectionBreak}`}
              >
                {"Owned by: " + owner}
              </div>

              <div
                className={`${styles.workDescription} ${styles.displayLinebreak} ${styles.sectionBreak}`}
              >
                {tokenMetadata?.data?.description}
              </div>
              <div
                className={`${styles.workAuthorLink} ${styles.sectionBreak}`}
              >
                {workQuery?.data?.externalLink ? (
                  <a
                    href={workQuery?.data?.externalLink}
                    rel="noreferrer"
                    target={"_blank"}
                  >
                    {workQuery?.data?.externalLink}
                  </a>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className={"mt-4"}>
              <h4>Attributes</h4>
              {tokenMetadata.data?.attributes && (
                <Attributes
                  attributes={tokenMetadata.data.attributes}
                ></Attributes>
              )}
            </div>
            <div className={"mt-2"}>
              <h4>Traits</h4>
              {tokenMetadata.data?.traits && (
                <Attributes attributes={tokenMetadata.data.traits}></Attributes>
              )}
            </div>
          </RowThinContainer>
        </Container>
      </div>
    </>
  );
};

WorkTokenPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default WorkTokenPage;
