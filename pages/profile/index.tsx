import {
  FC,
  Fragment,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Container, Row, Toast } from "react-bootstrap";
import { useRouter } from "next/router";
import * as jwt from "jsonwebtoken";
import MainLayout from "../../src/layout/MainLayout";
import SpinnerLoading from "../../src/components/loading/Loader";
import { trpcNextPW } from "../../src/server/utils/trpc";
import { EditUserRequest } from "../../src/store";
import { RowThinContainer } from "src/components/layout/RowThinContainer";
import { EditProfile } from "src/components/profile/EditProfile";
import { useToast } from "src/hooks/useToast";
import { ButtonPW } from "src/components/button/Button";
import { ToastContent } from "react-toastify/dist/types";
import { UserProfile } from "src/components/profile/UserProfile";
import { FlexBox } from "src/components/layout/FlexBoxCenter";

// import "react-toastify/dist/ReactToastify.css";
import { WorkSerializable } from "src/dbtypes/works/workSerializable";
import Link from "next/link";
import useUserContext from "src/context/user/useUserContext";
import { useStargazeClient, useWallet } from "@stargazezone/client";
import { UserSerializable } from "src/dbtypes/users/userSerializable";
import { shortenAddress } from "src/wasm/address";
import { useUserRequired } from "src/hooks/useUserRequired";
import { NeedToLoginButton } from "src/components/login/NeedToLoginButton";
import {
  signMessageAndLogin,
  signMessageAndLoginIfNeeded,
} from "src/wasm/keplr/client-login";
import { onMutateLogin } from "src/trpc/onMutate";
import { useNameInfo, useProfileInfo } from "../../src/hooks/sg-names";
import { WorkRow } from "../../src/components/profile/WorkRow";
import { Hr } from "../../src/components/content/horizontalrule/HR";

interface Props {
  work: WorkSerializable;
}

export const WorkLineItem: FC<Props> = ({ work }: Props) => {
  return (
    <div>
      <span>
        {work.name} {" | "}
        <Link href={`/work/${work.slug}`} passHref={true}>
          View
        </Link>
        {" | "}
        <Link href={`/create/${work.id}`} passHref={true}>
          Edit
        </Link>
      </span>
    </div>
  );
};

interface UserWorksProps {
  user: UserSerializable;
}

export const UserWorks: FC<UserWorksProps> = (props: UserWorksProps) => {
  const [pageNumber, setPageNumber] = useState(0);
  console.log("pageNumber", pageNumber);

  const limit = 5;
  const userWorksPage = trpcNextPW.works.listAddressWorks.useQuery({
    publishedState: "ALL",
    limit,
    address: props.user.address,
    direction: "DESC",
    cursor: pageNumber * limit,
  });

  const hasMore = userWorksPage.data?.nextCursor ? true : false;
  const hasPrevious = pageNumber > 0;
  const nextPage = useCallback(() => {
    if (hasMore) {
      setPageNumber((prev) => prev + 1);
    }
  }, [hasMore]);
  const prevPage = useCallback(() => {
    if (hasPrevious) {
      setPageNumber((prev) => prev - 1);
    }
  }, [hasPrevious]);

  const hasItems = !!userWorksPage.data?.items?.length;
  const pageItems: WorkSerializable[] =
    hasItems && userWorksPage.data?.items ? userWorksPage.data.items : [];
  return (
    <div>
      <h2 className={"mt-2"}>Works</h2>
      {userWorksPage.isLoading && <SpinnerLoading />}
      {userWorksPage.isSuccess &&
        hasItems &&
        // pageItems?.map((page, index) => (
        //   <Fragment key={page.items[0]?.id || index}>
        //     {page.items.map((w) => (
        //       <span key={w.id}>
        //         <Hr className={"text-muted"} />
        //         <WorkRow work={w}></WorkRow>
        //       </span>
        //     ))}
        //   </Fragment>
        // ))}
        pageItems.map((w) => (
          <span key={w.id}>
            <Hr className={"text-muted"} />
            <WorkRow work={w}></WorkRow>
          </span>
        ))}
      {/*))}*/}

      {userWorksPage.isSuccess && hasItems && (
        <div>
          <div className={"mt-3"}>
            <ButtonPW
              onClick={() => prevPage()}
              disabled={!hasPrevious || userWorksPage.isLoading}
            >
              {userWorksPage.isLoading ? "Loading..." : "Previous"}
            </ButtonPW>
            <ButtonPW
              className={"ms-2"}
              onClick={() => nextPage()}
              disabled={!hasMore || userWorksPage.isLoading}
            >
              {userWorksPage.isLoading ? "Loading more..." : "Next"}
            </ButtonPW>
          </div>
          <div className={"mt-3"}></div>
        </div>
      )}
      {userWorksPage.isSuccess && !hasItems && (
        <div>
          <div>You haven't created any Works yet.</div>
          <div>
            <Link href={"/create"} passHref={true}>
              <ButtonPW variant={"secondary"}>Create Work</ButtonPW>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

const ProfilePage = () => {
  const utils = trpcNextPW.useContext();
  const [editMode, setEditMode] = useState(false);

  const sgwallet = useWallet();
  const sgclient = useStargazeClient();
  const useName = useProfileInfo({ address: sgwallet.wallet?.address });

  const { user } = useUserContext();
  const address = sgwallet?.wallet?.address;
  const username = useName.walletName ? useName.walletName + ".stars" : address;

  // useUserRequired("/profile");

  const toast = useToast();
  const editUserMutation = trpcNextPW.users.editUser.useMutation({
    onMutate: onMutateLogin(sgclient.client, toast),
    onSuccess: () => {
      toast.success("Saved!");

      setEditMode(false);
      utils.users.getUser.invalidate();
    },
    onError: (e) => {
      setEditMode(false);
      toast.error(e.message);
    },
  });
  const onSubmitEdit = (req: Partial<EditUserRequest>) => {
    editUserMutation.mutate(req);
  };
  const displayUsername =
    username && username === address ? shortenAddress(address || "") : username;
  //EditProfile
  return (
    <>
      <div>
        <Container>
          <RowThinContainer>
            <FlexBox style={{ display: "inline", alignItems: "center" }}>
              <h1>
                Profile -{" "}
                {useName.isLoading ? (
                  <SpinnerLoading />
                ) : (
                  <span className={"text-reset"}>{displayUsername || ""}</span>
                )}
              </h1>

              {/*{!editMode && (*/}
              {/*  <ButtonPW*/}
              {/*    variant={"outline-primary"}*/}
              {/*    className={"ms-2"}*/}
              {/*    onClick={() => setEditMode(true)}*/}
              {/*  >*/}
              {/*    Edit*/}
              {/*  </ButtonPW>*/}
              {/*)}*/}
            </FlexBox>

            {/*{!sgwallet.loading && !user.isLoading && (*/}
            <NeedToLoginButton url={"/profile"} />
            {/*)}*/}

            {/*{user.isLoading && (*/}
            {/*  <div>*/}
            {/*    <SpinnerLoading />*/}
            {/*  </div>*/}
            {/*)}*/}
            {!editMode && user.isSuccess && <UserProfile user={user.data} />}
            {editMode && (
              <EditProfile defaultValues={user.data} onSubmit={onSubmitEdit} />
            )}
            {editMode && editUserMutation.isLoading && <SpinnerLoading />}
            {/*{authLoaded && <NameWork onCreateProject={onCreateProject} />}*/}
            {/*{mutation.isLoading && <SpinnerLoading />}*/}
            {/*{mutation.error && <p>{mutation.error.message}</p>}*/}
            {!editMode && user.data && <UserWorks user={user.data} />}
            {/*{!sgwallet.loading && !user.isLoading && !user?.data?.id && (*/}
            {/*  <p>*/}
            {/*    Claim your profile by logging in.*/}
            {/*    <Link*/}
            {/*      href={`/login?redirect=${encodeURIComponent("/profile")}`}*/}
            {/*    >*/}
            {/*      <ButtonPW>Login</ButtonPW>*/}
            {/*    </Link>*/}
            {/*  </p>*/}
            {/*)}*/}
          </RowThinContainer>
        </Container>
      </div>
    </>
  );
};

const createWithMsg: ToastContent = ({ closeToast }) => {
  console.log("hi from the toast");
  return (
    <Toast onClose={closeToast}>
      <Toast.Header>
        <strong className="me-auto">Bootstrap</strong>
        <small>11 mins ago</small>
      </Toast.Header>
      <Toast.Body>hello</Toast.Body>
    </Toast>
  );
};

ProfilePage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout metaTitle={"Create"}>{page}</MainLayout>;
};

export default ProfilePage;
