import {
  FC,
  Fragment,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Button, Container, Toast } from "react-bootstrap";
import { useRouter } from "next/router";
import * as jwt from "jsonwebtoken";
import { RowWideContainer } from "../../src/components/layout/RowWideContainer";
import MainLayout from "../../src/layout/MainLayout";
import SpinnerLoading from "../../src/components/loading/Loader";
import { getCookie } from "../../src/util/cookie";
import { trpcNextPW } from "../../src/server/utils/trpc";
import { EditProjectRequest, EditUserRequest } from "../../src/store";
import { NameWork } from "../../src/components/creatework/NameWork";
import { RowThinContainer } from "src/components/layout/RowThinContainer";
import { getToken } from "src/util/auth-token";
import { useCosmosWallet } from "src/components/provider/CosmosWalletProvider";
import { EditProfile } from "src/components/profile/EditProfile";
import { useToast } from "src/hooks/useToast";
import { ButtonPW } from "src/components/button/Button";
import { ToastContent } from "react-toastify/dist/types";
import { toast } from "react-toastify";
import { UserProfile } from "src/components/profile/UserProfile";
import { FlexBox } from "src/components/layout/FlexBoxCenter";
// import "react-toastify/dist/ReactToastify.css";

import { WorkSerializable } from "src/dbtypes/works/workSerializable";
import Link from "next/link";

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

const ProfilePage = () => {
  const utils = trpcNextPW.useContext();
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);

  const wallet = useCosmosWallet();
  const account = wallet.onlineClient?.accounts
    ? wallet.onlineClient?.accounts[0]
    : undefined;
  useEffect(() => {
    const account = wallet.onlineClient?.accounts
      ? wallet.onlineClient?.accounts[0]
      : undefined;
    if (!account) {
      router.push({
        pathname: "/login",
        query: {
          redirect: "/profile",
        },
      });
    }
  }, [wallet.onlineClient?.accounts]);

  const user = trpcNextPW.users.getUser.useQuery({
    address: account?.address,
  });

  const userWorks = trpcNextPW.works.listWorks.useInfiniteQuery(
    {
      limit: 4,
      address: user?.data?.address,
    },
    {
      getPreviousPageParam: (lastPage) => {
        return lastPage.nextCursor;
      },
      getNextPageParam: (lastPage) => {
        // console.log("hsdfdsfsdaasdf", lastPage);
        return lastPage.nextCursor;
      },
      enabled: !user.isLoading,
    }
  );

  const [authLoaded, setAuthLoaded] = useState(false);
  useEffect(() => {
    const redirectHere = () => {
      return router.push({
        pathname: "/login",
        query: {
          redirect: "/profile",
        },
      });
    };
    const token = getToken();
    if (!token) {
      redirectHere();
      return;
    }
    const decoded = jwt.decode(token);
    if (!decoded || typeof decoded === "string") {
      redirectHere();
      return;
    }
    if (Date.now() >= (decoded.exp || 0) * 1000) {
      console.log("expired");
      redirectHere();
      return;
    }
    setAuthLoaded(true);
    console.log("logged in");
  }, [router]);

  const toast = useToast();
  const editUserMutation = trpcNextPW.users.editUser.useMutation({
    onSuccess: () => {
      toast.success("Saved!");

      setEditMode(false);
      utils.users.getUser.invalidate();
    },
  });
  const onSubmitEdit = (req: Partial<EditUserRequest>) => {
    editUserMutation.mutate(req);
  };

  const userWorksPages = (userWorks.data?.pages || []).concat([]).reverse();

  //EditProfile
  return (
    <>
      <div>
        <Container>
          <RowThinContainer>
            <FlexBox style={{ display: "inline", alignItems: "center" }}>
              <h1>
                Profile -{" "}
                {user.isLoading ? <SpinnerLoading /> : user.data?.name}
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

            {user.isLoading && <SpinnerLoading />}
            {!editMode && user.isSuccess && <UserProfile user={user.data} />}
            {editMode && (
              <EditProfile defaultValues={user.data} onSubmit={onSubmitEdit} />
            )}
            {/*{authLoaded && <NameWork onCreateProject={onCreateProject} />}*/}
            {/*{mutation.isLoading && <SpinnerLoading />}*/}
            {/*{mutation.error && <p>{mutation.error.message}</p>}*/}
            {!editMode && (
              <div>
                <h2>Works</h2>
                {userWorks.isLoading && <SpinnerLoading />}
                {userWorks.isSuccess &&
                  userWorksPages.length &&
                  userWorksPages?.map((page, index) => (
                    <>
                      <Fragment key={page.items[0]?.id || index}>
                        {page.items.map((w) => (
                          <div key={w.id}>
                            <WorkLineItem work={w}></WorkLineItem>
                          </div>
                        ))}
                      </Fragment>
                    </>
                  ))}
                {userWorks.isSuccess && userWorksPages.length && (
                  <ButtonPW
                    onClick={() => userWorks.fetchPreviousPage()}
                    disabled={
                      !userWorks.hasNextPage || userWorks.isFetchingNextPage
                    }
                  >
                    {userWorks.isFetchingNextPage
                      ? "Loading more..."
                      : userWorks.hasNextPage
                      ? "Load More"
                      : "Nothing more to load"}
                  </ButtonPW>
                )}

                {userWorks.isSuccess && !userWorksPages.length && (
                  <div>You haven't created any Works.</div>
                )}
              </div>
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
