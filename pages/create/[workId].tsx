import { work } from "../../src/helio";
import { ReactElement, useCallback } from "react";
import MainLayout from "../../src/layout/MainLayout";
import { NftMetadata } from "../../src/hooks/useNftMetadata";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { Container } from "react-bootstrap";
import Head from "next/head";
import { firestore, ProjectRepo } from "../../src/store";
import { DropZone } from "../../src/components/DropZone";
import { stores } from "../../src/store/stores";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const workId = context.params?.workId;
  if (!workId || Array.isArray(workId) || !Number.isFinite(parseInt(workId))) {
    return {
      notFound: true,
    };
  }

  let metadata: NftMetadata | null = null;
  const project = await stores().project.getProject(workId)
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
      work:project,
      workId
    }
  }

}

const EditWorkPage = ({ work, workId }: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  const onUpload = useCallback(async (files:File[])=>{
    // console.log("files",files)

    if(files.length!==1){
      throw new Error('required single file')
    }
    const formData = new FormData();
    formData.append("file", files[0])
    const response = await fetch(`/api/${workId}/workUpload`, {
      method: "POST",
      body: formData,
    });
    console.log('workUpload status',response.status)
  }, [])
  
  return (<>
    <Head>
      <title key={'title'}>{`Create ${workId} - publicworks.art`}</title>
    </Head>
    <div>

      <Container>
        <DropZone onUpload={(files)=>onUpload(files)} />
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