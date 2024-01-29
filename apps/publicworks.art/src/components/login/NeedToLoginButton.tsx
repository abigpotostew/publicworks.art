// @flow
import { FC } from "react";
import useUserContext from "src/context/user/useUserContext";
import { useWallet } from "@stargazezone/client";
import { ButtonPW } from "src/components/button/Button";
import { useRouter } from "next/router";
import { getToken } from "src/util/auth-token";
import { LoginModal } from "../modal/LoginModal";
import ModalStore from "../../modal/ModalStore";

export const NeedToLoginButton: FC = () => {
  const router = useRouter();
  const { user } = useUserContext();
  const { wallet } = useWallet();
  const token = getToken();
  // console.log("data", wallet, user.data, token);
  // console.log("user.data", user.data);
  return (
    <>
      {!wallet || !user.data || !token ? (
        <div>
          Login to continue{" "}
          {/*<Link href={"/login?redirect=" + url} passHref={true}>*/}
          <ButtonPW
            onClick={() => {
              // router.push({
              //   pathname: "/login",
              //   query: {
              //     redirect: url,
              //   },
              // });
              ModalStore.open("LoginModal", {});
            }}
          >
            Login
          </ButtonPW>
          {/*</Link>*/}
        </div>
      ) : null}
    </>
  );
};
