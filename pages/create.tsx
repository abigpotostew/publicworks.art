import { NameWork } from "../src/components/creatework/NameWork";
import SpinnerLoading from "../src/components/loading/Loader";
import { useClientLoginMutation } from "../src/hooks/useClientLoginMutation";
import MainLayout from "../src/layout/MainLayout";
import { trpcNextPW } from "../src/server/utils/trpc";
import { EditProjectRequest } from "../src/store";
import config from "../src/wasm/config";
import { useStargazeClient } from "@stargazezone/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactElement, useCallback, useEffect } from "react";
import { Alert, Container } from "react-bootstrap";
import { RowThinContainer } from "src/components/layout/RowThinContainer";
import useUserContext from "src/context/user/useUserContext";
import { useToast } from "src/hooks/useToast";
import { onMutateLogin } from "src/trpc/onMutate";

const CreatePage = () => {
  const { user } = useUserContext();
  const utils = trpcNextPW.useContext();
  const router = useRouter();
  const toast = useToast();
  const sgclient = useStargazeClient();
  const login = useClientLoginMutation();
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
  }, [mutation, router]);

  const onCreateProject = useCallback(
    async (req: Partial<EditProjectRequest>) => {
      // console.log("res", req);
      if (!req.name) {
        throw new Error("missing name");
      }
      await login.mutateAsync();
      mutation.mutate({ name: req.name });
    },
    [login, mutation]
  );

  const testnetComponent = config.testnet ? null : (
    <Alert variant={"warning"}>
      Test your collection on{" "}
      <Link href={"https://testnet.publicworks.art/create"}>
        testnet.publicworks.art
      </Link>{" "}
      before publishing here on mainnet.
    </Alert>
  );
  return (
    <>
      <div>
        <Container>
          <RowThinContainer>
            <h1>Create Work</h1>
            {testnetComponent}
            <NameWork onCreateProject={onCreateProject} hideTitle={true} />

            {mutation.isPending && <SpinnerLoading />}
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
