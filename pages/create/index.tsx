import { ReactElement, useCallback, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useRouter } from "next/router";
import * as jwt from "jsonwebtoken";
import { CreateWork } from "../../src/components/creatework/CreateWork";
import { RowWideContainer } from "../../src/components/layout/RowWideContainer";
import MainLayout from "../../src/layout/MainLayout";
import SpinnerLoading from "../../src/components/loading/Loader";
import { getCookie } from "../../src/util/cookie";
import { trpcNextPW } from "../../src/server/utils/trpc";
import { CreateProjectRequest } from "../../src/store";

const CreatePage = () => {
  const utils = trpcNextPW.useContext();
  const router = useRouter();
  const mutation = trpcNextPW.works.createWork.useMutation({
    onSuccess: async () => {
      // await router.push(`/create/${mutation.data.id}`);
    },
  });

  useEffect(() => {
    console.log("in mutation effect", mutation);
    if (mutation && mutation.isSuccess) {
      (async () => {
        await router.push(`/create/${mutation?.data?.id}`);
      })();
    }
  }, [mutation]);

  const [authLoaded, setAuthLoaded] = useState(false);
  useEffect(() => {
    const token = getCookie("PWToken");
    if (!token) {
      router.push("/login");
      return;
    }
    const decoded = jwt.decode(token);
    if (!decoded || typeof decoded === "string") {
      router.push("/login");
      return;
    }
    if (Date.now() >= (decoded.exp || 0) * 1000) {
      console.log("expired");
      router.push("/login");
      return;
    }
    setAuthLoaded(true);
    console.log("logged in");
  }, [router]);

  const onCreateProject = useCallback(
    async (req: CreateProjectRequest) => {
      console.log("res", req);
      mutation.mutate({ ...req });
    },
    [mutation]
  );

  // const onUpload = useCallback(async (files: File[]) => {
  //   // console.log("files",files)
  //
  //   if (files.length !== 1) {
  //     throw new Error("required single file");
  //   }
  //   const formData = new FormData();
  //   formData.append("file", files[0]);
  //   const response = await fetch("/api/workUpload", {
  //     method: "POST",
  //     body: formData,
  //   });
  //   console.log("workUpload status", response.status);
  // }, []);

  // useEffect(()=>{
  //   if(mutation.error)
  //   router.push(`/create/${body.workId}`)
  // },[mutation])

  return (
    <>
      <div>
        <Container>
          <RowWideContainer>
            <h1>Create Work</h1>
          </RowWideContainer>

          <RowWideContainer>
            {authLoaded && <CreateWork onCreateProject={onCreateProject} />}
            {mutation.isLoading && <SpinnerLoading />}
            {mutation.error && <p>{mutation.error.message}</p>}
          </RowWideContainer>
        </Container>
      </div>
    </>
  );
};

CreatePage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout metaTitle={"Create"}>{page}</MainLayout>;
};

export default CreatePage;
