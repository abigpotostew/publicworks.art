import { FC, Fragment, ReactElement, useEffect, useState } from "react";
import { Container, Row, Toast } from "react-bootstrap";
import { useRouter } from "next/router";
import * as jwt from "jsonwebtoken";
import MainLayout from "../../src/layout/MainLayout";
import SpinnerLoading from "../../src/components/loading/Loader";
import { trpcNextPW } from "../../src/server/utils/trpc";
import { EditUserRequest } from "../../src/store";
import { RowThinContainer } from "src/components/layout/RowThinContainer";
import { getToken } from "src/util/auth-token";
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
  const userWorks = trpcNextPW.works.listAddressWorks.useInfiniteQuery(
    {
      publishedState: "ALL",
      limit: 100,
      address: props.user.address,
    },
    {
      getPreviousPageParam: (lastPage) => {
        return lastPage.nextCursor;
      },
      getNextPageParam: (lastPage) => {
        // console.log("hsdfdsfsdaasdf", lastPage);
        return lastPage.nextCursor;
      },
    }
  );
  const hasItems = userWorks.data?.pages?.length
    ? !!userWorks.data?.pages[0].items.length
    : false;
  const userWorksPages = (userWorks.data?.pages || []).concat([]).reverse();
  console.log("userWorksPages", userWorksPages);
  return (
    <div>
      <h2>Works</h2>
      {userWorks.isLoading && <SpinnerLoading />}
      {userWorks.isSuccess &&
        hasItems &&
        userWorksPages?.map((page, index) => (
          <Fragment key={page.items[0]?.id || index}>
            {page.items.map((w) => (
              <div key={w.id}>
                <WorkLineItem work={w}></WorkLineItem>
              </div>
            ))}
          </Fragment>
        ))}

      {userWorks.isSuccess && hasItems && (
        <ButtonPW
          onClick={() => userWorks.fetchPreviousPage()}
          disabled={!userWorks.hasNextPage || userWorks.isFetchingNextPage}
        >
          {userWorks.isFetchingNextPage
            ? "Loading more..."
            : userWorks.hasNextPage
            ? "Load More"
            : "Nothing more to load"}
        </ButtonPW>
      )}
      {userWorks.isSuccess && !hasItems && (
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

  const { user } = useUserContext();
  const address = sgwallet?.wallet?.address;
  const username = user.data?.name;

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
  const token = getToken();
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
                {user.isLoading ? (
                  <SpinnerLoading />
                ) : (
                  <span className={"text-reset"}>{displayUsername || ""}</span>
                )}
              </h1>

              {!editMode && (
                <ButtonPW
                  style={{ marginLeft: ".75 rem" }}
                  onClick={() => setEditMode(true)}
                >
                  Edit
                </ButtonPW>
              )}
            </FlexBox>
            <NeedToLoginButton url={"/profile"} />

            {user.isLoading && <SpinnerLoading />}
            {!editMode && user.isSuccess && <UserProfile user={user.data} />}
            {editMode && (
              <EditProfile defaultValues={user.data} onSubmit={onSubmitEdit} />
            )}
            {editMode && editUserMutation.isLoading && <SpinnerLoading />}
            {/*{authLoaded && <NameWork onCreateProject={onCreateProject} />}*/}
            {/*{mutation.isLoading && <SpinnerLoading />}*/}
            {/*{mutation.error && <p>{mutation.error.message}</p>}*/}
            {!editMode && user.data && <UserWorks user={user.data} />}
            {!user.isLoading && !user?.data?.id && (
              <p>
                Claim your profile by logging in.
                <Link
                  href={`/login?redirect=${encodeURIComponent("/profile")}`}
                >
                  <ButtonPW>Login</ButtonPW>
                </Link>
              </p>
            )}
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
