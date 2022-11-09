import { ToastContainer, toast } from "react-toastify";
import { Toast } from "react-bootstrap";
import { ToastContent } from "react-toastify/dist/types";
import { UseToastTypes } from "src/hooks/useToast.types";
import { useRouter } from "next/router";

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
export const useToast = (): UseToastTypes => {
  const router = useRouter();
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
  };
};
