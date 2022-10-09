import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Toast } from "react-bootstrap";
import { ToastContent } from "react-toastify/dist/types";

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
export const useToast = () => {
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
  };
};
