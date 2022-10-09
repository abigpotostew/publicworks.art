import { ReactElement, useCallback, useEffect, useState } from "react";
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
// import "react-toastify/dist/ReactToastify.css";

const ProfilePage = () => {
  const utils = trpcNextPW.useContext();
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);

  const wallet = useCosmosWallet();
  const account = wallet.onlineClient?.accounts
    ? wallet.onlineClient?.accounts[0]
    : undefined;
  // useEffect(() => {
  //   const account = wallet.onlineClient?.accounts
  //     ? wallet.onlineClient?.accounts[0]
  //     : undefined;
  //   if (!account) {
  //     router.push({
  //       pathname: "/login",
  //       query: {
  //         redirect: "/profile",
  //       },
  //     });
  //   }
  // }, [wallet.onlineClient?.accounts]);

  const user = trpcNextPW.users.getUser.useQuery({
    address: account?.address,
  });

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
      toast.success("success!");
      // toast.success(createWithMsg);
      // toast.success("success");

      setEditMode(false);
    },
  });
  const onSubmitEdit = (req: Partial<EditUserRequest>) => {
    editUserMutation.mutate(req);
  };
  //EditProfile
  return (
    <>
      <div>
        <Container>
          <RowThinContainer>
            <h1>Profile</h1>
            <p>{account?.address}</p>
            {user.isLoading && <SpinnerLoading />}
            {!editMode && user.isSuccess && <p>{user.data.name}</p>}
            {editMode && (
              <EditProfile defaultValues={user.data} onSubmit={onSubmitEdit} />
            )}
            {/*{authLoaded && <NameWork onCreateProject={onCreateProject} />}*/}
            {/*{mutation.isLoading && <SpinnerLoading />}*/}
            {/*{mutation.error && <p>{mutation.error.message}</p>}*/}
            {!editMode && (
              <ButtonPW onClick={() => setEditMode(true)}>Edit</ButtonPW>
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
