import { ButtonPW as Button } from "../../../src/components/button/Button";
import { WorkOnChain } from "../../../src/components/creatework/WorkOnChain";
import { generateTxHash } from "../../../src/generateHash";
import { useClientLoginMutation } from "../../../src/hooks/useClientLoginMutation";
import MainLayout from "../../../src/layout/MainLayout";
import { WorkSerializable } from "@publicworks/db-typeorm";
import { useStargazeClient, useWallet } from "@stargazezone/client";
import Head from "next/head";
import { useRouter } from "next/router";
import { FC, ReactElement, useCallback, useEffect, useState } from "react";
import { Container, Form } from "react-bootstrap";
import { ConfettiScreen } from "src/components/celebration/ConfettiScreen";
import { ConfirmConfig } from "src/components/creatework/ConfirmConfig";
import { DescribeWork } from "src/components/creatework/DescribeWork";
import { NameWork } from "src/components/creatework/NameWork";
import { NftDetails2 } from "src/components/creatework/NftDetails2";
import { UploadCoverImage } from "src/components/creatework/UploadCoverImage";
import { FlexBox, FlexBoxCenter } from "src/components/layout/FlexBoxCenter";
import { RowThinContainer } from "src/components/layout/RowThinContainer";
import SpinnerLoading from "src/components/loading/Loader";
import { Step, StepProgressBar } from "src/components/progress/StepProgressBar";
import { TooltipInfo } from "src/components/tooltip/TooltipInfo";
import useUserContext from "src/context/user/useUserContext";
import { useInstantiate } from "src/hooks/useInstantiate";
import { useToast } from "src/hooks/useToast";
import { trpcNextPW } from "src/server/utils/trpc";
import { EditProjectRequest } from "src/store/project.types";
import { onMutateLogin } from "src/trpc/onMutate";
import { getToken } from "src/util/auth-token";
import { useUploadWorkMutation } from "src/works/upload";
import ButtonGroup from "react-bootstrap/ButtonGroup";

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
  "submit",
  "view",
] as const;
type Stage = (typeof stages)[number];
const stageContinuationCondition: Record<Stage, (keyof WorkSerializable)[]> = {
  name_art: ["name", "codeCid"],
  text: ["description"],
  nft_detail: [
    "maxTokens",
    "startDate",
    "priceStars",
    "selector",
    "resolution",
  ],
  cover_image: ["coverImageCid"],
  submit: ["minter"],
  view: ["minter"],
};

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
  nextDisabled?: boolean;
}

const NavButtons: FC<INavButtons> = ({
  onNextClick,
  onPrevClick,
  nextDisabled,
}) => {
  // @ts-ignore
  return (
    // <Container fluid={true}>
    <div
      className={
        "tw-bg-white tw-w-full tw-fixed tw-left-0 tw-bottom-0 tw-p-3 tw-border-solid tw-border-1 tw-border-slate-100"
      }
    >
      <div className={"tw-flex tw-justify-center tw-items-center "}>
        <ButtonGroup>
          <Button
            variant={"outline-secondary"}
            className={" "}
            onClick={onPrevClick || (() => undefined)}
          >
            Back
          </Button>
          <Button
            variant={"outline-primary"}
            className={""}
            disabled={!onNextClick || nextDisabled}
            onClick={onNextClick || (() => undefined)}
          >
            Next
          </Button>
        </ButtonGroup>
      </div>
    </div>
    // </Container>
  );
};

const EditWorkPage = () => {
  const router = useRouter();
  const { workId: workIdIn } = router.query;
  const workId =
    typeof workIdIn === "string" ? parseInt(workIdIn.split("?", 1)[0]) : 0;
  const [hash, setHash] = useState<string>(generateTxHash());

  const { user } = useUserContext();
  const userToken = getToken();
  const hasToken = !!userToken;

  const [showConfetti, setShowConfetti] = useState(false);

  const sgwallet = useWallet();

  const login = useClientLoginMutation();
  const { stage: stageQp } = router.query;
  const [stage, setStageState] = useState<Stage | null>(null);
  // useUserRequired("/create/" + workIdIn + "?stage=" + stageQp);
  const redirectUrl = "/create/" + workIdIn + "?stage=" + stageQp;
  useEffect(() => {
    const stage = stages.find((s) => s === router.query?.stage?.toString());
    setStageState(stage || stages[0]);
  }, [router]);
  const setStage = (newStage: Stage) => {
    setFormValid(false);
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
  const setStageNextFrom = (currStage: Stage) => {
    setStage(stages[stages.indexOf(currStage) + 1]);
  };
  const setStagePrevFrom = (currStage: Stage) => {
    mutation.reset();
    setStage(stages[stages.indexOf(currStage) - 1]);
  };

  const utils = trpcNextPW.useContext();
  const getWorkQuery = trpcNextPW.works.getWorkById.useQuery(
    {
      id: workId,
    },
    { enabled: !!workId } //workId is temporarily empty string while router loads
  );
  const work =
    !getWorkQuery.isLoading && !getWorkQuery.error && getWorkQuery.data
      ? getWorkQuery.data
      : null;

  const toast = useToast();
  const sgclient = useStargazeClient();
  const mutation = trpcNextPW.works.editWork.useMutation({
    onMutate: onMutateLogin(sgclient.client, toast),
    onSuccess() {
      toast.success("Saved!");
      utils.works.getWorkById.invalidate();
      console.log("invalidated the work!");
      getWorkQuery.refetch();
      console.log("fetched the work!");
    },
  });

  const onCreateProject = useCallback(
    async (req: Partial<EditProjectRequest>) => {
      console.log("workId", workId);
      console.log("edit request", { ...req, id: workId });
      await login.mutateAsync();
      await mutation.mutateAsync({ ...req, id: workId });
      console.log("finished on create project mutation");
    },
    [login, mutation, workId]
  );

  const onUploadMutation = useUploadWorkMutation(workId);

  const onUpload = onUploadMutation.mutate;

  const { instantiateMutation } = useInstantiate();
  const [useSimulatedGasFee, setUseSimulatedGasFee] = useState<boolean>(false);

  const onInstantiate = useCallback(async () => {
    //confetti
    if (!work) return;
    const success = await instantiateMutation.mutateAsync({ work });
    if (!success) return;
    console.log("instantiate and showing confettie");
    toast.success("Successfully instantiated!");
    setShowConfetti(true);
  }, [work, instantiateMutation, toast, useSimulatedGasFee]);

  const createStep = (stageEnum: Stage): Step => {
    const completed =
      !!stage && stages.indexOf(stage) >= stages.indexOf(stageEnum);
    const isStageClickable = (stage: Stage) => {
      if (!work) return false;
      //first stage is alwasy clickable
      if (stage === stages[0]) return true;
      const prevStage = stages[stages.indexOf(stage) - 1];
      const prevStageComplete = !stageContinuationCondition[prevStage].find(
        (c) => !work[c]
      );
      return prevStageComplete;
    };
    const clickable = completed || work?.minter || isStageClickable(stageEnum);
    return {
      label: (stages.indexOf(stageEnum) + 1).toString(),
      // @ts-ignore
      description: stageMd[stageEnum]?.label || "<missing>",
      active: stage === stageEnum,
      completed,
      onClick: clickable ? () => setStage(stageEnum) : undefined,
    };
  };

  const [formValid, setFormValid] = useState(false);
  const [formTouched, setFormTouched] = useState(false);
  const setFormState = (props: { isValid: boolean; isTouched: boolean }) => {
    setFormValid(props.isValid);
    setFormTouched(props.isTouched);
  };

  const canOperate = !user.isLoading && !!user.data && hasToken;

  const canMoveToNext =
    canOperate && formTouched ? mutation.isSuccess && formValid : formValid;

  console.log("canMoveToNext", {
    canMoveToNext,
    canOperate,
    formTouched,
    isSuccess: mutation.isSuccess,
    formValid,
  });

  const steps = stages.map((s) => {
    return createStep(s);
  });

  // useEffect(() => {
  //   if (workId && !hasToken) {
  //     toast.errorLoginModal();
  //   }
  // }, [workId, hasToken, toast]);

  return (
    <>
      <Head>
        <title key={"title"}>{`Create ${workId} - publicworks.art`}</title>
      </Head>
      {showConfetti && <ConfettiScreen />}

      <Container fluid={false}>
        <StepProgressBar items={steps}></StepProgressBar>
        <>
          <FlexBoxCenter fluid={false} className={"tw-pb-24"}>
            {stage === "submit" && (
              // <Container fluid={false}>
              <>
                <FlexBoxCenter fluid={false}>
                  {work && (
                    <ConfirmConfig
                      work={work}
                      setUseSimulatedGasFee={setUseSimulatedGasFee}
                    />
                  )}
                </FlexBoxCenter>
                <div>
                  {/*<Form.Check*/}
                  {/*  type="switch"*/}
                  {/*  id="custom-switch"*/}
                  {/*  label="Check this switch"*/}
                  {/*  value={useSimulatedGasFee.toString()}*/}
                  {/*  onChange={() => setUseSimulatedGasFee(!useSimulatedGasFee)}*/}
                  {/*/>*/}
                  {
                    <Button
                      disabled={
                        !sgwallet.wallet?.address ||
                        instantiateMutation.isLoading
                      }
                      onClick={() => onInstantiate()}
                      variant={"danger"}
                    >
                      {work && !work.sg721 && <span>Instantiate On Chain</span>}
                      {work && work.sg721 && (
                        <span>
                          Instantiate + Replace Chain{" "}
                          <TooltipInfo>
                            Your contract is already deployed. Instantiating it
                            again will replace the old instance on
                            publicworks.art
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
              </>
              // </Container>
            )}
            {stage === "view" && work && (
              // <Container fluid={false}>
              <>
                <WorkOnChain
                  work={work}
                  minter={work.minter}
                  slug={work.slug}
                />
                <div className={"Margin-T-1"}>
                  {
                    <Button
                      variant={"secondary"}
                      onClick={() => setStagePrevFrom("view")}
                    >
                      Back
                    </Button>
                  }
                </div>
              </>
              // </Container>
            )}

            {stage === "text" && (
              <>
                {getWorkQuery.isLoading && <SpinnerLoading></SpinnerLoading>}
                {getWorkQuery.error && <div>{getWorkQuery.error.message}</div>}
                {work && (
                  <DescribeWork
                    defaultValues={work}
                    onCreateProject={onCreateProject}
                    formValid={setFormState}
                  ></DescribeWork>
                )}
                {/*{mutation.isSuccess && <div>Successfully saved</div>}*/}
                <NavButtons
                  onPrevClick={() => setStagePrevFrom("text")}
                  onNextClick={() => setStageNextFrom("text")}
                  nextDisabled={!canMoveToNext}
                ></NavButtons>
              </>
              // </Container>
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
                    {/*{mutation.isSuccess && <div>Successfully saved</div>}*/}
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
                  <>
                    <FlexBoxCenter fluid={false}>
                      <div>
                        <NftDetails2
                          key={work.updatedDate}
                          onCreateProject={onCreateProject}
                          defaultValues={work}
                          formValid={setFormState}
                        />
                        {!mutation.isLoading && mutation.error && (
                          <div>{mutation.error.message}</div>
                        )}
                        {/*{mutation.isSuccess && <div>Successfully saved</div>}*/}
                      </div>
                      {/*<div>*/}
                      {/*  {work && (*/}
                      {/*    <>*/}
                      {/*      <LiveMedia*/}
                      {/*        ipfsUrl={*/}
                      {/*          normalizeMetadataUri("ipfs://" + work.codeCid) +*/}
                      {/*          "?hash=" +*/}
                      {/*          hash*/}
                      {/*        }*/}
                      {/*        minHeight={500}*/}
                      {/*        style={{}}*/}
                      {/*      ></LiveMedia>*/}
                      {/*      <a onClick={onClickRefreshHash}>*/}
                      {/*        <FlexBox*/}
                      {/*          style={{*/}
                      {/*            justifyContent: "flex-start",*/}
                      {/*            flexDirection: "row",*/}
                      {/*            alignItems: "center",*/}
                      {/*          }}*/}
                      {/*        >*/}
                      {/*          <div>New Hash</div>*/}
                      {/*          <BsArrowRepeat style={{ marginLeft: ".5rem" }} />*/}
                      {/*        </FlexBox>*/}
                      {/*      </a>*/}
                      {/*    </>*/}
                      {/*  )}*/}
                      {/*  <DropZone onUpload={(files) => onUpload(files)} />*/}
                      {/*</div>*/}
                    </FlexBoxCenter>
                    <NavButtons
                      onPrevClick={() => setStagePrevFrom("nft_detail")}
                      onNextClick={() => setStageNextFrom("nft_detail")}
                      nextDisabled={!canMoveToNext}
                    ></NavButtons>
                    {/*</Container>*/}
                  </>
                )}
              </>
            )}

            {stage === "name_art" && (
              <>
                {getWorkQuery.isLoading && <SpinnerLoading></SpinnerLoading>}
                {getWorkQuery.error && <div>{getWorkQuery.error.message}</div>}
                {work && (
                  // <Container fluid={false}>
                  <>
                    <div>
                      <NameWork
                        onUpload={onUpload}
                        onCreateProject={onCreateProject}
                        defaultValues={work}
                      />
                      <>
                        {onUploadMutation.isLoading && (
                          <div>
                            Uploading... <SpinnerLoading />
                          </div>
                        )}
                      </>
                      <>
                        {!onUploadMutation.isLoading &&
                          onUploadMutation.isSuccess && (
                            <div className={"mt-2"}>
                              Successfully uploaded code!
                            </div>
                          )}
                      </>
                      <>
                        {" "}
                        {!onUploadMutation.isLoading &&
                          onUploadMutation.error && (
                            <div>
                              {(onUploadMutation?.error as any)?.message}
                            </div>
                          )}
                      </>
                      <>
                        {!mutation.isLoading && mutation.error && (
                          <div>{mutation.error.message}</div>
                        )}
                      </>
                      {/*{mutation.isSuccess && <div>Successfully saved</div>}*/}

                      <NavButtons
                        onNextClick={() => setStageNextFrom("name_art")}
                        onPrevClick={() => setStagePrevFrom("name_art")}
                      />
                    </div>
                  </>
                  // </Container>
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
          </FlexBoxCenter>
        </>
      </Container>
    </>
  );
};

EditWorkPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default EditWorkPage;
