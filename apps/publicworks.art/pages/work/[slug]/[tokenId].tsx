import { ReactElement, useState } from "react";
import MainLayout from "../../../src/layout/MainLayout";
import styles from "../../../styles/Work.module.scss";
import { Container } from "react-bootstrap";
import { LiveMedia } from "../../../src/components/media/LiveMedia";
import { RowThinContainer } from "../../../src/components/layout/RowThinContainer";
import { RowSquareContainer } from "../../../src/components/layout/RowSquareContainer";
import { NftMetadata } from "../../../src/hooks/useNftMetadata";
import { getTokenMetadata, normalizeIpfsUri } from "../../../src/wasm/metadata";
import Link from "next/link";
import Head from "next/head";
import { useTokenOwner } from "../../../src/hooks/useTokenOwner";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { trpcNextPW } from "src/server/utils/trpc";
import SpinnerLoading from "src/components/loading/Loader";
import { Attributes } from "../../../src/components/metadata/Attributes";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { initializeIfNeeded } from "../../../src/typeorm/datasource";
import { stores } from "../../../src/store/stores";
import {
  serializeWork,
  serializeWorkToken,
} from "@publicworks/db-typeorm/serializable";
import { StarsAddressName } from "../../../src/components/name/StarsAddressName";
import { FieldControl } from "../../../src/components/control/FieldControl";
import { TokenEntity } from "@publicworks/db-typeorm/model/work.entity";

export async function getStaticPaths() {
  console.log("getStaticPaths, token");
  await initializeIfNeeded();
  const out: { params: { slug: string; tokenId: string } }[] = [];
  let nextOffset: number | undefined = undefined;
  const next: number | undefined = undefined;
  let tokens: TokenEntity[] = [];
  do {
    const res: { items: TokenEntity[]; nextOffset: number | undefined } =
      await stores().project.getTokens({
        limit: 500,
        offset: nextOffset ? nextOffset : 0,
        publishedState: "PUBLISHED",
        includeHidden: true,
      });
    nextOffset = res.nextOffset;
    tokens = res.items;
    out.push(
      ...tokens.map((s) => {
        return { params: { slug: s.work.slug, tokenId: s.token_id } };
      })
    );
    console.log("getStaticPaths, token, nextOffset", nextOffset);
  } while (nextOffset);
  // const static = [work];
  console.log("getStaticPaths, token, done");
  return {
    paths: out,
    fallback: "blocking",
  };
}

export const getStaticProps: GetStaticProps = async (context) => {
  await initializeIfNeeded();
  const slug = context.params?.slug;
  const tokenId = context.params?.tokenId;
  if (typeof slug !== "string" || typeof tokenId !== "string") {
    return {
      notFound: true,
    };
  }
  const work = await stores().project.getProjectBySlug(slug);
  if (!work) {
    return {
      notFound: true,
    };
  }

  const token = await stores().project.getToken({ workId: work.id, tokenId });

  return {
    props: {
      slug,
      token: token ? serializeWorkToken(token) : null,
      work: serializeWork(work),
      tokenId,
    },
    revalidate: 10, // In seconds
    // fallback: "blocking",
  };
};

const WorkTokenPage = ({
  work,
  slug,
  tokenId,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();
  // const { slug, tokenId } = router.query;
  const [notFound, setNotFound] = useState(false);

  const workQuery = trpcNextPW.works.getWorkBySlug.useQuery(
    { slug: slug?.toString() || "" },
    { enabled: !!slug }
  );
  const { data } = workQuery;
  work = data || work;

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
    { enabled: !!work && !!slug && !!tokenId && !!work?.sg721 }
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
                {"Owned by: "}
                <StarsAddressName address={owner} />
              </div>

              <div
                className={`${styles.displayLinebreak} ${styles.sectionBreak}`}
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
            <div>
              <h5 className={"mt-4"}>Metadata</h5>
              <FieldControl name={"Contract"}>
                {work.sg721 ? (
                  <StarsAddressName address={work.sg721} noShorten={false} />
                ) : null}
              </FieldControl>
              <FieldControl name={"Minter"}>
                {work.minter ? (
                  <StarsAddressName address={work.minter} noShorten={false} />
                ) : null}
              </FieldControl>
              <a
                href={tokenMetadata?.data?.image}
                className={"Token-link"}
                download={"true"}
              >
                Image
              </a>{" "}
              |{" "}
              <a
                href={tokenMetadata?.data?.animation_url}
                target={"_blank"}
                className={"Token-link"}
                rel="noreferrer"
              >
                Live
              </a>
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
  // console.log("page token", page.props.slug);
  // const name = page.props.work.name;
  // const creator = page.props.work.creator;
  // const router = useRouter();
  // const { pid } = router.query;
  // console.log({ page });
  // page.props.tokenId;
  let img = "";
  if (page.props.token?.imageUrl) {
    img = normalizeIpfsUri(page.props.token.imageUrl);
  }
  let title = "";
  if (page.props.work?.name) {
    title = page.props.work.name;
  }
  if (page.props.tokenId) {
    title = `${title} #${page.props.tokenId}`;
  }
  const imgUrl = img
    ? `${
        process.env.NEXT_PUBLIC_HOST
      }/api/ogimage/work?img=${encodeURIComponent(img)}`
    : "";
  // console.log(
  //   "token",
  //   page.props.work?.slug,
  //   page.props.token?.token_id,
  //   "imgUrl",
  //   imgUrl
  // );
  return (
    <MainLayout metaTitle={title} image={imgUrl}>
      {page}
    </MainLayout>
  );
};
export const config = {
  staticPageGenerationTimeout: 120,
};

export default WorkTokenPage;
