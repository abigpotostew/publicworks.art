import { ReactElement } from "react";
import MainLayout from "../../../src/layout/MainLayout";
import styles from "../../../styles/Work.module.css";
import { Container } from "react-bootstrap";
import { LiveMedia } from "../../../src/components/media/LiveMedia";
import { RowThinContainer } from "../../../src/components/layout/RowThinContainer";
import { RowSquareContainer } from "../../../src/components/layout/RowSquareContainer";
import { NftMetadata } from "../../../src/hooks/useNftMetadata";
import SpinnerLoading from "../../../src/components/loading/Loader";
import { getTokenMetadata, getTokenOwner } from "../../../src/wasm/metadata";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { work } from "../../../src/helio";
import Link from "next/link";
import Head from "next/head";
import { useTokenOwner } from "../../../src/hooks/useTokenOwner";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const slug = context.params?.slug;
  const tokenId = context.params?.tokenId;
  if (!tokenId || Array.isArray(tokenId) || !Number.isFinite(parseInt(tokenId))) {
    return {
      notFound: true,
    };
  }

  let metadata: NftMetadata | null = null;
  const fetchMd=async ()=>{
    try {
      metadata = await getTokenMetadata(work.sg721, tokenId)
    } catch (e) {
      console.warn(`error fetching ${slug} ${tokenId}`,e)
    }
    if(!metadata){
      try{
        metadata = await getTokenMetadata(work.sg721, tokenId, 'https://ipfs.publicworks.art/ipfs/')
      }
      catch (e) {
        console.warn(`error fetching attempt 2 ${slug} ${tokenId}`,e)
      }
    }
  }
  const [md, owner]=await Promise.all([fetchMd(), getTokenOwner(work.sg721, tokenId)])
  
  if (!metadata) {
    return {
      notFound: true,
    };
  }
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=300, stale-while-revalidate=400'
  )
  
  return {
    props: {
      work,
      metadata,
      tokenId,
      tokenOwner:owner,
    }
  }

}

const WorkTokenPage = ({ metadata, work, tokenId, tokenOwner }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  
  const loading = false;
  const errorMetadata = false;
  const {loading:ownerLoading,error,owner}=useTokenOwner({sg721:work.sg721, tokenId})
  const tokenOwnerRealized = ((ownerLoading || error) && !owner) ? tokenOwner : owner;
  return (<>
    <Head>
      <title key={'title'}>{`${work.title} #${tokenId} - publicworks.art`}</title>
    </Head>
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

            <div className={`${styles.workAuthorLink} ${styles.displayLinebreak} ${styles.sectionBreak}`}>
              {'Owned by: '+tokenOwnerRealized}
            </div>
            
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