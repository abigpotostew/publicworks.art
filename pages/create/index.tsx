import { ReactElement, useCallback, useEffect } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useRouter } from "next/router";
import * as jwt from 'jsonwebtoken'
import { trpc } from "../../src/util/trpc";
import { CreateProjectRequest, CreateWork } from "../../src/components/creatework/CreateWork";
import { RowWideContainer } from "../../src/components/layout/RowWideContainer";
import MainLayout from "../../src/layout/MainLayout";
import SpinnerLoading from "../../src/components/loading/Loader";
import { getCookie } from "../../src/util/cookie";

const CreatePage = () => {
  const router = useRouter();
  const mutation = trpc.useMutation(['private.createWork']);

  useEffect(() => {
    const token = getCookie('PWToken')
    if(!token ){
      router.push('/login')
      return;
    }
    const decoded = jwt.decode(token )
    if(!decoded || typeof decoded==='string'){
      router.push('/login')
      return;
    }
    if (Date.now() >= (decoded.exp || 0) * 1000) {
      console.log('expired')
      router.push('/login')
      return;
    }
    console.log('logged in')
  }, [router]);
  
  const onCreateProject = useCallback(async (req:CreateProjectRequest)=>{
     mutation.mutate( { ...req });
  }, [])
  
  // useEffect(()=>{
  //   if(mutation.error)
  //   router.push(`/create/${body.workId}`)
  // },[mutation])
  
  return (<>
    <div>
      <Container>
        <RowWideContainer>
          <h1>Create Work</h1>
        </RowWideContainer>
        
        <RowWideContainer>
          
          <CreateWork onCreateProject={onCreateProject} />
          {mutation.isLoading && <SpinnerLoading />}
          {mutation.error && <p>{mutation.error.message}</p>}

        </RowWideContainer>
      </Container>

    </div>
  </>)
}

CreatePage.getLayout = function getLayout(page: ReactElement) {
  return (
    <MainLayout metaTitle={'Create'}>
      {page}
    </MainLayout>
  );
};

export default CreatePage;