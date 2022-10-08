import { FC, ReactElement, useCallback, useEffect, useState } from "react";
import Head from "next/head";
import { BsArrowRepeat } from "react-icons/bs";
import { useRouter } from "next/router";
import MainLayout from "../../../src/layout/MainLayout";
import { Container } from "react-bootstrap";
import { ButtonPW as Button } from "../../../src/components/button/Button";
import { generateTxHash } from "../../../src/generateHash";
import { useCosmosWallet } from "../../../src/components/provider/CosmosWalletProvider";
import { FlexBox, FlexBoxCenter } from "src/components/layout/FlexBoxCenter";
import { useInstantiate } from "src/hooks/useInstantiate";
import { trpcNextPW } from "src/server/utils/trpc";
import { onWorkUpload } from "src/works/upload";
import { LiveMedia } from "src/components/media/LiveMedia";
import { Step, StepProgressBar } from "src/components/progress/StepProgressBar";
import { TooltipInfo } from "src/components/TooltipInfo";
import { NameWork } from "src/components/creatework/NameWork";
import { EditProjectRequest } from "src/store";
import { DropZone } from "src/components/DropZone";
import { normalizeMetadataUri } from "src/wasm/metadata";
import { ConfettiScreen } from "src/components/celebration/ConfettiScreen";
import SpinnerLoading from "src/components/loading/Loader";
import { DescribeWork } from "src/components/creatework/DescribeWork";
import { UploadCoverImage } from "src/components/creatework/UploadCoverImage";
import { ConfirmConfig } from "src/components/creatework/ConfirmConfig";
import { NftDetails2 } from "src/components/creatework/NftDetails2";

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

const stages = [
  "name_art",
  "text",
  "nft_detail",
  "cover_image",
  // "review",
  "submit",
  "view",
];
const stageMd = {
  name_art: {
    label: "Code",
  },
  text: {
    label: "Describe",
  },
  nft_detail: {
    label: "Config",
  },
  cover_image: {
    label: "Image",
  },
  submit: {
    label: "Submit",
  },
  view: {
    label: "Mint",
  },
};
interface INavButtons {
  onNextClick?: () => void;
  onPrevClick?: () => void;
}

const NavButtons: FC<INavButtons> = ({ onNextClick, onPrevClick }) => {
  // @ts-ignore
  return (
    <Container fluid={true}>
      <FlexBox style={{ justifyContent: "flex-end" }}>
        {onPrevClick && <Button onClick={onPrevClick}>Prev</Button>}
        {onNextClick && <Button onClick={onNextClick}>Next</Button>}
      </FlexBox>
    </Container>
  );
};

const EditWorkPage = () => {
  const router = useRouter();
  const { workId: workIdIn } = router.query;
  const workId = workIdIn?.toString() || "";
  const [hash, setHash] = useState<string>(generateTxHash());

  const [showConfetti, setShowConfetti] = useState(false);

  const wallet = useCosmosWallet();

  const { stage: stageQp } = router.query;
  const [stage, setStageState] = useState<string>("");
  useEffect(() => {
    setStageState(router.query?.stage?.toString() || stages[0]);
  }, [router]);
  console.log("STAGE IS", stage);
  const setStage = (newStage: string) => {
    setShowConfetti(false);
    setStageState(newStage);
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
  const setStageNextFrom = (currStage: string) => {
    setStage(stages[stages.indexOf(currStage) + 1]);
  };
  const setStagePrevFrom = (currStage: string) => {
    mutation.reset();
    setStage(stages[stages.indexOf(currStage) - 1]);
  };

  const utils = trpcNextPW.useContext();
  const getWorkQuery = trpcNextPW.works.getWorkById.useQuery(
    {
      id: workId,
    },
    { enabled: workId !== "" } //workId is temporarily empty string while router loads
  );
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
    async (req: Partial<EditProjectRequest>) => {
      console.log("workId", workId);
      console.log("edit request", { ...req, id: workId });
      mutation.mutate({ ...req, id: workId });
    },
    [mutation]
  );

  const onUpload = async (files: File[]) => {
    await onWorkUpload(workId, files, utils);
  };

  const { instantiateMutation } = useInstantiate();

  const onClickRefreshHash = useCallback(() => {
    setHash(generateTxHash());
  }, []);

  const onInstantiate = useCallback(async () => {
    //confetti
    if (!work) return;
    await instantiateMutation.mutateAsync(work);
    console.log("instantiate and showing confettie");
    setShowConfetti(true);
  }, [work]);

  const createStep = (stageEnum: string): Step => {
    const completed = stages.indexOf(stage) >= stages.indexOf(stageEnum);

    return {
      label: (stages.indexOf(stageEnum) + 1).toString(),
      // @ts-ignore
      description: stageMd[stageEnum]?.label || "<missing>",
      active: stage === stageEnum,
      completed,
      onClick: completed ? () => setStage(stageEnum) : undefined,
    };
  };

  console.log("hi");

  // const steps: Step[] = [
  //   {
  //     label: "1",
  //     description: "Edit",
  //     active: stage === "edit",
  //     completed: stages.indexOf(stage) >= stages.indexOf("edit"),
  //   },
  //   {
  //     label: "2",
  //     description: "Submit",
  //     active: stage === "submit",
  //     completed: stage !== "edit" && stage !== "submit",
  //   },
  //   {
  //     label: "3",
  //     description: "View",
  //     active: stage === "view",
  //     completed: stage !== "edit" && stage !== "view" && stage !== "submit",
  //   },
  // ];
  const steps = stages.map((s) => {
    return createStep(s);
  });

  return (
    <>
      <Head>
        <title key={"title"}>{`Create ${workId} - publicworks.art`}</title>
      </Head>
      {showConfetti && <ConfettiScreen />}
      <StepProgressBar items={steps}></StepProgressBar>
      {stage === "submit" && (
        <Container fluid={false}>
          <FlexBoxCenter fluid={false}>
            {work && <ConfirmConfig work={work} />}
          </FlexBoxCenter>
          <div>
            {
              <Button
                disabled={!wallet.isConnected}
                onClick={() => onInstantiate()}
              >
                {work && !work.sg721 && <span>Instantiate On Chain</span>}
                {work && work.sg721 && (
                  <span>
                    Instantiate + Replace Chain{" "}
                    <TooltipInfo>
                      Your contract is already deployed. Instantiating it again
                      will replace the old instance on publicworks.art
                    </TooltipInfo>
                  </span>
                )}
              </Button>
            }
          </div>

          <NavButtons
            onPrevClick={() => setStagePrevFrom("submit")}
            onNextClick={
              work?.sg721 ? () => setStageNextFrom("submit") : undefined
            }
          ></NavButtons>
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
          <div>
            {<Button onClick={() => setStagePrevFrom("view")}>Back</Button>}
          </div>
        </Container>
      )}

      {stage === "text" && (
        <Container fluid={false}>
          {getWorkQuery.isLoading && <SpinnerLoading></SpinnerLoading>}
          {getWorkQuery.error && <div>{getWorkQuery.error.message}</div>}
          {work && (
            <DescribeWork
              defaultValues={work}
              onCreateProject={onCreateProject}
            ></DescribeWork>
          )}
          {mutation.isSuccess && <div>Successfully saved</div>}
          <NavButtons
            onPrevClick={() => setStagePrevFrom("text")}
            onNextClick={() => setStageNextFrom("text")}
          ></NavButtons>
        </Container>
      )}

      {stage === "cover_image" && (
        <>
          {getWorkQuery.isLoading && <SpinnerLoading></SpinnerLoading>}
          {getWorkQuery.error && <div>{getWorkQuery.error.message}</div>}
          {work && (
            <Container>
              <UploadCoverImage
                onCreateProject={onCreateProject}
                defaultValues={work}
              />
              {!mutation.isLoading && mutation.error && (
                <div>{mutation.error.message}</div>
              )}
              {mutation.isSuccess && <div>Successfully saved</div>}
              <NavButtons
                onPrevClick={() => setStagePrevFrom("cover_image")}
                onNextClick={() => setStageNextFrom("cover_image")}
              ></NavButtons>
            </Container>
          )}
        </>
      )}

      {stage === "nft_detail" && (
        <>
          {getWorkQuery.isLoading && <SpinnerLoading></SpinnerLoading>}
          {getWorkQuery.error && <div>{getWorkQuery.error.message}</div>}
          {work && (
            <Container>
              <FlexBoxCenter fluid={false}>
                <div>
                  <NftDetails2
                    onCreateProject={onCreateProject}
                    defaultValues={work}
                  />
                  {!mutation.isLoading && mutation.error && (
                    <div>{mutation.error.message}</div>
                  )}
                  {mutation.isSuccess && <div>Successfully saved</div>}
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
                        <FlexBox
                          style={{
                            justifyContent: "flex-start",
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <div>New Hash</div>
                          <BsArrowRepeat style={{ marginLeft: ".5rem" }} />
                        </FlexBox>
                      </a>
                    </>
                  )}
                  <DropZone onUpload={(files) => onUpload(files)} />
                </div>
              </FlexBoxCenter>
              <NavButtons
                onPrevClick={() => setStagePrevFrom("nft_detail")}
                onNextClick={
                  mutation.isSuccess
                    ? () => setStageNextFrom("nft_detail")
                    : undefined
                }
              ></NavButtons>
            </Container>
          )}
        </>
      )}

      {stage === "name_art" && (
        <>
          {getWorkQuery.isLoading && <SpinnerLoading></SpinnerLoading>}
          {getWorkQuery.error && <div>{getWorkQuery.error.message}</div>}
          {work && (
            <Container>
              <h2>Work Name & Code Upload</h2>
              <FlexBoxCenter fluid={false}>
                <div>
                  <NameWork
                    onUpload={onUpload}
                    onCreateProject={onCreateProject}
                    defaultValues={work}
                  />
                  {!mutation.isLoading && mutation.error && (
                    <div>{mutation.error.message}</div>
                  )}
                  {mutation.isSuccess && <div>Successfully saved</div>}

                  <NavButtons
                    onNextClick={() => setStageNextFrom("name_art")}
                    onPrevClick={() => setStagePrevFrom("name_art")}
                  ></NavButtons>
                </div>
              </FlexBoxCenter>
            </Container>
          )}
        </>
      )}

      {/*{stage === "review" && (*/}
      {/*  <>*/}
      {/*    {getWorkQuery.isLoading && <SpinnerLoading></SpinnerLoading>}*/}
      {/*    {getWorkQuery.error && <div>{getWorkQuery.error.message}</div>}*/}
      {/*    {work && (*/}
      {/*      <Container>*/}
      {/*        <h2>Review</h2>*/}

      {/*        <div>*/}
      {/*          <NameWork*/}
      {/*            onUpload={onUpload}*/}
      {/*            onCreateProject={onCreateProject}*/}
      {/*            defaultValues={work}*/}
      {/*          />*/}
      {/*          {!mutation.isLoading && mutation.error && (*/}
      {/*            <div>{mutation.error.message}</div>*/}
      {/*          )}*/}
      {/*          {mutation.isSuccess && <div>Successfully saved</div>}*/}

      {/*          <NavButtons*/}
      {/*            onPrevClick={() => setStagePrevFrom("review")}*/}
      {/*            onNextClick={() => setStageNextFrom("review")}*/}
      {/*          ></NavButtons>*/}
      {/*        </div>*/}
      {/*      </Container>*/}
      {/*    )}*/}
      {/*  </>*/}
      {/*)}*/}
    </>
  );
};

EditWorkPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default EditWorkPage;
