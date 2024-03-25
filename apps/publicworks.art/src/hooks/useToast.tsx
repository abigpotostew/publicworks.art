import { ToastContainer, toast } from "react-toastify";
import { Toast } from "react-bootstrap";
import { ToastContent } from "react-toastify/dist/types";
import { UseToastTypes } from "src/hooks/useToast.types";
import { useRouter } from "next/router";
import chainInfo from "../stargaze/chainInfo";
import ModalStore from "../modal/ModalStore";
import { useState } from "react";

const createToastWithMessage = (msg: string): ToastContent => {
  return ({ closeToast }) => {
    console.log("hi from the toast");
    return (
      <Toast bg={"dark"} onClose={closeToast}>
        {/*<Toast.Header>*/}
        {/*  <strong className="me-auto">Bootstrap</strong>*/}
        {/*  /!*<small>11 mins ago</small>*!/*/}
        {/*</Toast.Header>*/}
        <Toast.Body className={"text-white"}>{msg}</Toast.Body>
      </Toast>
    );
  };
};
const ToastStore = {
  loginToastOpen: false,
  setLoginToastOpen: function (open: boolean) {
    this.loginToastOpen = open;
  },
};
export const useToast = (): UseToastTypes => {
  const router = useRouter();
  const [loginToastOpen, setLoginToastOpen] = useState(false);
  return {
    success: (msg: string) => {
      toast.success(msg, {
        theme: "dark",
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
      });
    },
    txHash: (msg: string, txHash: string) => {
      toast.success(msg, {
        theme: "dark",
        position: "top-right",
        autoClose: 15000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        onClick: () => {
          window.open(
            chainInfo().explorerUrlToTx.replace("{txHash}", txHash),
            "_blank"
          );
        },
      });
    },
    mint: (msg: string, slug: string, tokenId: string) => {
      toast.success(msg, {
        theme: "dark",
        position: "top-right",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        onClick: () => {
          window.open(`/work/${slug}/${tokenId}`, "_blank");
        },
      });
    },
    error: (msg: string) => {
      toast.error(msg, {
        theme: "dark",
        position: "top-right",
        autoClose: 10_000,
        hideProgressBar: true,

        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
      });
    },
    errorRedirect: (msg: string, redirect: string) => {
      toast.error(msg, {
        theme: "dark",
        position: "top-right",
        hideProgressBar: true,
        closeOnClick: true,
        onClick: () => {
          router.push({
            pathname: "/login",
            query: {
              redirect,
            },
          });
        },
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
      });
    },
    errorLoginModal: () => {
      if (ToastStore.loginToastOpen) return;
      toast.error("Login required, click to Login", {
        theme: "dark",
        position: "top-right",
        hideProgressBar: true,
        closeOnClick: true,
        onClick: () => {
          ModalStore.open("LoginModal", {});
          ToastStore.setLoginToastOpen(true);
        },
        onOpen: () => {
          ToastStore.setLoginToastOpen(false);
        },
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
      });
    },
  };
};
