import { ReactElement, useCallback, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useRouter } from "next/router";
import * as jwt from "jsonwebtoken";
import { RowWideContainer } from "../../src/components/layout/RowWideContainer";
import MainLayout from "../../src/layout/MainLayout";
import SpinnerLoading from "../../src/components/loading/Loader";
import { getCookie } from "../../src/util/cookie";
import { trpcNextPW } from "../../src/server/utils/trpc";
import { EditProjectRequest } from "../../src/store";
import { NameWork } from "../../src/components/creatework/NameWork";
import { RowThinContainer } from "src/components/layout/RowThinContainer";

const CreatePage = () => {
  const utils = trpcNextPW.useContext();
  const router = useRouter();
  const mutation = trpcNextPW.works.createWork.useMutation({
    onSuccess: async () => {
      // await router.push(`/create/${mutation.data.id}`);
    },
  });

  useEffect(() => {
    // console.log("in mutation effect", mutation);
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
      router.push({
        pathname: "/login",
        query: {
          redirect: "/create",
        },
      });
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
    async (req: Partial<EditProjectRequest>) => {
      // console.log("res", req);
      if (!req.projectName) {
        throw new Error("missing name");
      }
      mutation.mutate({ projectName: req.projectName });
    },
    [mutation]
  );

  return (
    <>
      <div>
        <Container>
          <RowThinContainer>
            <h1>Create Work</h1>

            {authLoaded && <NameWork onCreateProject={onCreateProject} />}
            {mutation.isLoading && <SpinnerLoading />}
            {mutation.error && <p>{mutation.error.message}</p>}
          </RowThinContainer>
        </Container>
      </div>
    </>
  );
};

CreatePage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout metaTitle={"Create"}>{page}</MainLayout>;
};

export default CreatePage;
