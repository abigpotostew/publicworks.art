import { RowThinContainer } from "../../src/components/layout/RowThinContainer";
import { RowSquareContainer } from "../../src/components/layout/RowSquareContainer";
import { work } from "../../src/helio";
import { LiveMedia } from "../../src/components/media/LiveMedia";
import { ReactElement } from "react";
import MainLayout from "../../src/layout/MainLayout";
import { NftMetadata } from "../../src/hooks/useNftMetadata";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { Container } from "react-bootstrap";
import { getTokenMetadata } from "../../src/wasm/metadata";
import SpinnerLoading from "../../src/components/loading/Loader";
import { inspect } from "util";
import Link from "next/link";
import Head from "next/head";
import styles from '../../styles/Work.module.css'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const workId = context.params?.workId;
  if (!workId || Array.isArray(workId) || !Number.isFinite(parseInt(workId))) {
    return {
      notFound: true,
    };
  }

  let metadata: NftMetadata | null = null;
  // try {
  //   metadata = await getTokenMetadata(work.sg721, tokenId)
  // } catch (e) {
  //   console.warn(`error fetching ${slug} ${tokenId}`,e)
  // }
  // if(!metadata){
  //   try{
  //     metadata = await getTokenMetadata(work.sg721, tokenId, 'https://ipfs.publicworks.art/ipfs/')
  //   }
  //   catch (e) {
  //     console.warn(`error fetching attempt 2 ${slug} ${tokenId}`,e)
  //   }
  // }
  // if (!metadata) {
  //   return {
  //     notFound: true,
  //   };
  // }
  // context.res.setHeader(
  //   'Cache-Control',
  //   'public, s-maxage=300, stale-while-revalidate=400'
  // )
  
  return {
    props: {
      work,
      workId
    }
  }

}

const EditWorkPage = ({ work, workId }: InferGetServerSidePropsType<typeof getServerSideProps>) => {


  const loading = false;
  const errorMetadata = false;
  return (<>
    <Head>
      <title key={'title'}>{`Create ${workId} - publicworks.art`}</title>
    </Head>
    <div>

      <Container>
        
      </Container>
      <Container>
        
      </Container>

    </div>
  </>)
}

EditWorkPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <MainLayout>
      {page}
    </MainLayout>
  );
};

export default EditWorkPage;