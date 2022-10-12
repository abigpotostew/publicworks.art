// @flow
import { FC } from "react";
import useUserContext from "src/context/user/useUserContext";
import { useWallet } from "@stargazezone/client";
import { ButtonPW } from "src/components/button/Button";
import Link from "next/link";
import { useRouter } from "next/router";
interface Props {
  url: string;
}
export const NeedToLoginButton: FC<Props> = ({ url }) => {
  const router = useRouter();
  const { user } = useUserContext();
  const { wallet } = useWallet();
  return (
    <>
      {!wallet || user.isError ? (
        <div>
          You're not logged in.{" "}
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
