import { ReactElement, useCallback, useEffect } from "react";
import { Container } from "react-bootstrap";
import { useRouter } from "next/router";
import MainLayout from "../../src/layout/MainLayout";
import SpinnerLoading from "../../src/components/loading/Loader";
import { trpcNextPW } from "../../src/server/utils/trpc";
import { EditProjectRequest } from "../../src/store";
import { NameWork } from "../../src/components/creatework/NameWork";
import { RowThinContainer } from "src/components/layout/RowThinContainer";
import useUserContext from "src/context/user/useUserContext";
import { useStargazeClient, useWallet } from "@stargazezone/client";
import { NeedToLoginButton } from "src/components/login/NeedToLoginButton";
import { onMutateLogin } from "src/trpc/onMutate";
import { useToast } from "src/hooks/useToast";

const CreatePage = () => {
  const { user } = useUserContext();
  const utils = trpcNextPW.useContext();
  const router = useRouter();
  const toast = useToast();
  const sgclient = useStargazeClient();
  const mutation = trpcNextPW.works.createWork.useMutation({
    onMutate: onMutateLogin(sgclient.client, toast),
    onSuccess: async () => {
      utils.works.getWorkById.invalidate();
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

  const onCreateProject = useCallback(
    async (req: Partial<EditProjectRequest>) => {
      // console.log("res", req);
      if (!req.name) {
        throw new Error("missing name");
      }
      mutation.mutate({ name: req.name });
    },
    [mutation]
  );

  return (
    <>
      <div>
        <Container>
          <RowThinContainer>
            <h1>Create Work</h1>

            {user.isLoading && <SpinnerLoading />}
            <NeedToLoginButton url={"/create"} />
            {user.isSuccess && <NameWork onCreateProject={onCreateProject} />}

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
