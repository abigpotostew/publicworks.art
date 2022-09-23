import { ReactElement, useCallback, useState } from "react";
import Head from "next/head";
import { BsArrowRepeat } from "react-icons/bs";
import { useRouter } from "next/router";
import { CreateProjectRequest } from "../../../src/store";
import { CreateWork } from "../../../src/components/creatework/CreateWork";
import { FlexBox } from "../../../src/components/layout/FlexBox";
import { trpcNextPW } from "../../../src/server/utils/trpc";
import { normalizeMetadataUri } from "../../../src/wasm/metadata";
import SpinnerLoading from "../../../src/components/loading/Loader";
import { LiveMedia } from "../../../src/components/media/LiveMedia";
import { DropZone } from "../../../src/components/DropZone";
import MainLayout from "../../../src/layout/MainLayout";
import { Button, Container } from "react-bootstrap";
import { ConfirmConfig } from "../../../src/components/creatework/ConfirmConfig";
import { useInstantiate } from "../../../src/hooks/useInstantiate";

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   await initializeIfNeeded();
//   const workId = context.params?.workId;
//   if (!workId || typeof workId !== "string") {
//     return {
//       notFound: true,
//     };
//   }
//
//   const project = await stores().project.getProject(workId);
//
//   if (!project) {
//     return {
//       notFound: true,
//     };
//   }
//
//   return {
//     props: {
//       work: serializeWork(project),
//       workId: project.id,
//       slug: project.slug,
//     },
//   };
// };
const generateTxHash = () => {
  const alphabet = "0123456789ABCDEF";
  return Array(64)
    .fill(0)
    .map((_) => alphabet[(Math.random() * alphabet.length) | 0])
    .join("");
};
// type Props = InferGetServerSidePropsType<typeof getServerSideProps>;
const EditWorkPage = () => {
  const router = useRouter();
  const { workId: workIdIn } = router.query;
  const workId = workIdIn?.toString() || "";
  const [hash, setHash] = useState<string>(generateTxHash());

  const { stage: stageQp } = router.query;
  const [stage, setStageState] = useState<string>(
    stageQp?.toString() || "edit"
  );
  const setStage = (newStage: string) => {
    setStageState(newStage);
    // console.log("router", router);
    // const url = new URL(router.asPath);
    // url.searchParams.set("stage", newStage);
    // router.push(url.href);
    const { pathname, query } = router;
    const { stage } = query;
    router.push({
      pathname,
      query: {
        ...query,
        stage: newStage,
      },
    });
  };

  const utils = trpcNextPW.useContext();
  const getWorkQuery = trpcNextPW.works.getWorkById.useQuery(
    {
      id: workId,
    },
    { enabled: workId !== "" } //workId is temporarily empty string while router loads
  );
  const codeUrl = getWorkQuery?.data?.codeCid;
  const work =
    !getWorkQuery.isLoading && !getWorkQuery.error && getWorkQuery.data
      ? getWorkQuery.data
      : null;

  const mutation = trpcNextPW.works.editWork.useMutation({
    onSuccess() {
      utils.works.getWorkById.invalidate();
    },
  });

  const mutationContracts = trpcNextPW.works.editWorkContracts.useMutation({
    onSuccess() {
      utils.works.getWorkById.invalidate();
    },
  });

  const onCreateProject = useCallback(
    async (req: CreateProjectRequest) => {
      console.log("workId", workId);
      console.log("edit request", { ...req, id: workId });
      mutation.mutate({ ...req, id: workId });
    },
    [mutation]
  );

  const onUpload = useCallback(
    async (files: File[]) => {
      // console.log("files",files)

      if (files.length !== 1) {
        throw new Error("required single file");
      }
      const formData = new FormData();
      formData.append("file", files[0]);
      const response = await fetch(`/api/${workId}/workUpload`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        //todo set error status
        return;
      }
      const newCodeUrl = (await response.json()).url;
      // setCodeUrl(newCodeUrl);
      console.log("workUpload status", newCodeUrl);
      utils.works.getWorkById.invalidate();
    },
    [workId]
  );
  const { instantiate } = useInstantiate();

  const onClickRefreshHash = useCallback(() => {
    setHash(generateTxHash());
  }, []);

  const onInstantiate = useCallback(async () => {
    if (!work) return;
    const res = await instantiate(work);
    mutationContracts.mutate({
      sg721: res.sg721,
      minter: res.minter,
      id: work.id,
    });
    //confetti
  }, [work]);

  return (
    <>
      <Head>
        <title key={"title"}>{`Create ${workId} - publicworks.art`}</title>
      </Head>
      {stage === "submit" && (
        <Container fluid={false}>
          <FlexBox fluid={false}>
            {work && <ConfirmConfig work={work} />}
          </FlexBox>
          <div>
            {
              <Button onClick={() => onInstantiate()}>
                Instantiate On Chain
              </Button>
            }
          </div>
          <div>{<Button onClick={() => setStage("edit")}>Back</Button>}</div>
          {work?.sg721 && (
            <div>
              {" "}
              <Button onClick={() => setStage("view")}>View</Button>
            </div>
          )}
        </Container>
      )}
      {stage === "view" && work && (
        <Container fluid={false}>
          <a
            target={"_blank"}
            href={`https://testnet.publicawesome.dev/launchpad/${work.minter}`}
          >
            Mint
          </a>
          <div>{<Button onClick={() => setStage("submit")}>Back</Button>}</div>
        </Container>
      )}
      {stage === "edit" && (
        <>
          {getWorkQuery.isLoading && <SpinnerLoading></SpinnerLoading>}
          {getWorkQuery.error && <div>{getWorkQuery.error.message}</div>}
          {work && (
            <FlexBox fluid={false}>
              <div>
                <CreateWork
                  onCreateProject={onCreateProject}
                  defaultValues={work}
                />
                {!mutation.isLoading && mutation.error && (
                  <div>{mutation.error.message}</div>
                )}
                {mutation.isSuccess && <div>Successfully saved</div>}
                {<Button onClick={() => setStage("submit")}>Next</Button>}
              </div>
              <div>
                {work && (
                  <>
                    <LiveMedia
                      ipfsUrl={
                        normalizeMetadataUri("ipfs://" + work.codeCid) +
                        "?hash=" +
                        hash
                      }
                      minHeight={500}
                      style={{}}
                    ></LiveMedia>
                    <a onClick={onClickRefreshHash}>
                      <BsArrowRepeat />
                    </a>
                  </>
                )}
                <DropZone onUpload={(files) => onUpload(files)} />
              </div>
            </FlexBox>
          )}
        </>
      )}
    </>
  );
};

EditWorkPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default EditWorkPage;
