import { ReactElement } from "react";
import MainLayout from "../../../src/layout/MainLayout";
import styles from "../../../styles/Work.module.css";
import { Button, Container } from "react-bootstrap";
import { LiveMedia } from "../../../src/components/media/LiveMedia";
import { RowThinContainer } from "../../../src/components/layout/RowThinContainer";
import { RowSquareContainer } from "../../../src/components/layout/RowSquareContainer";
import { NumMinted } from "../../../src/components/work/NumMinted";
import { NftMetadata } from "../../../src/hooks/useNftMetadata";
import SpinnerLoading from "../../../src/components/loading/Loader";
import { getTokenMetadata } from "../../../src/wasm/metadata";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { RowWideContainer } from "../../../src/components/layout/RowWideContainer";
import { useNumMinted } from "../../../src/hooks/useNumMinted";
import { useCollectionSize } from "../../../src/hooks/useCollectionSize";
import { PagedGallery } from "../../../src/components/media/PagedGallery";
import { work } from "../../../src/helio";


export async function getStaticPaths() {
  return {
    paths: [work].map((s) => {
      return { params: { slug: s.slug } }
    }),
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const slug = context.params?.slug;
  if (slug !== 'helio') {
    return {
      notFound: true,
    };
  }


  let metadata: NftMetadata | null = null;
  try {
    metadata = await getTokenMetadata(work.sg721, '1')
  } catch (e) {

  }
  return {
    props: {
      work,
      metadata
    }
  }

}

const WorkPage = ({ metadata, work }: InferGetStaticPropsType<typeof getStaticProps>) => {


  // fetch num tokens
  const { numMinted, error: numMintedError, loading: numMintedLoading } = useNumMinted(work.sg721)
  const { collectionSize, error: collectionSizeError, loading: collSizeLoading } = useCollectionSize(work.minter)


  const loading = false;
  const errorMetadata = false;
  return (<>
    <div>
      <Container>
        <RowSquareContainer>
          <div className={`${styles.align_center} align-self-center`} style={{ minHeight: 500 }}>
            {loading ? <SpinnerLoading/> : errorMetadata ? <div>Something went wrong</div> :
              <LiveMedia ipfsUrl={metadata?.animation_url || work.preview_url} minHeight={500}/>}
          </div>
        </RowSquareContainer>
      </Container>
      <Container>

        <RowThinContainer className={`${styles.paddingTop} ${styles.workHeader}`}>
          <div className={styles.paddingTop}>
            <div>
            <span className={styles.workTitle}>
              {work.title}
            </span>
              <span className={styles.workAuthor}>
              {" - " + work.author}
            </span>
              <NumMinted sg721={work.sg721} minter={work.minter}/>
            </div>
            {work.testnet ? <div>** Showing Testnet Mints **</div> : <></>}
            <div className={`${styles.workDescription} ${styles.displayLinebreak} ${styles.sectionBreak}`}>
              {work.description}
            </div>
            <div className={`${styles.workAuthorLink} ${styles.sectionBreak}`}>
              <a href={work.authorLink} rel="noreferrer" target={'_blank'}>
                {work.authorLink}
              </a>
            </div>

            <div className={`${styles.sectionBreak}`}>
              <a className={"btn disabled"} href={'https://www.stargaze.zone/launchpad/' + work.minter} rel="noreferrer"
                 target={"_blank"}>
                <Button disabled={true}>Mint on stargaze.zone</Button>
              </a>
            </div>
          </div>
          Mint Price TBD
        </RowThinContainer>
      </Container>

      <Container>

        <RowWideContainer className={`${styles.tokensGrid}`}>
          {numMinted === 0  && <SpinnerLoading/>}
          {numMinted  && <PagedGallery slug={work.slug} sg721={work.sg721} totalNumTokens={numMinted}/>}
        </RowWideContainer>
      </Container>
    </div>
  </>)
}

WorkPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <MainLayout>
      {page}
    </MainLayout>
  );
};

export default WorkPage;