// @flow
import { FC } from "react";
import useUserContext from "src/context/user/useUserContext";
import { useWallet } from "@stargazezone/client";
import { ButtonPW } from "src/components/button/Button";
import Link from "next/link";
import { useRouter } from "next/router";
import { getToken } from "src/util/auth-token";
interface Props {
  url: string;
}
export const NeedToLoginButton: FC<Props> = ({ url }) => {
  const router = useRouter();
  const { user } = useUserContext();
  const { wallet } = useWallet();
  const token = getToken();
  return (
    <>
      {!wallet || user.isError || !token ? (
        <div>
          Login to continue{" "}
          <Link href={"/login?redirect=" + url} passHref={true}>
            <ButtonPW
              onClick={() => {
                router.push({
                  pathname: "/login",
                  query: {
                    redirect: url,
                  },
                });
              }}
            >
              Login
            </ButtonPW>
          </Link>
        </div>
      ) : null}
    </>
  );
};
