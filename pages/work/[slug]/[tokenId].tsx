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
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useNumMinted } from "../../../src/hooks/useNumMinted";
import { useCollectionSize } from "../../../src/hooks/useCollectionSize";
import { work } from "../../../src/helio";
import Link from "next/link";


export const getServerSideProps: GetServerSideProps = async (context) => {
  const tokenId = context.params?.tokenId;
  if (!tokenId || Array.isArray(tokenId) || !Number.isFinite(parseInt(tokenId))) {
    return {
      notFound: true,
    };
  }


  let metadata: NftMetadata | null = null;
  try {
    metadata = await getTokenMetadata(work.sg721, tokenId)
  } catch (e) {
    
  }
  if(!metadata){
    return {
      notFound: true,
    };
  }
  return {
    props: {
      work,
      metadata,
      tokenId
    }
  }

}

const WorkTokenPage = ({ metadata, work ,tokenId}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  

  const loading = false;
  const errorMetadata = false;
  return (<>
    <div>
      
      <Container>
        <Link href={`/work/${work.slug}`} passHref><span>{`<- Back to ${work.title}`}</span></Link>
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
              {metadata.name}
            </span>
              <span className={styles.workAuthor}>
              {" - " + work.author}
            </span>
            </div>
            {work.testnet ? <div>** Showing Testnet Mints **</div> : <></>}
            <div className={`${styles.workDescription} ${styles.displayLinebreak} ${styles.sectionBreak}`}>
              {metadata.description}
            </div>
            <div className={`${styles.workAuthorLink} ${styles.sectionBreak}`}>
              <a href={work.authorLink} rel="noreferrer" target={'_blank'}>
                {work.authorLink}
              </a>
            </div>

          </div>
        </RowThinContainer>
      </Container>

    </div>
  </>)
}

WorkTokenPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <MainLayout>
      {page}
    </MainLayout>
  );
};

export default WorkTokenPage;