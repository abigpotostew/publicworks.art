// @flow
import * as React from "react";
import ModalStore from "../../modal/ModalStore";
import { useSnapshot } from "valtio";
import { DeleteWorkModal } from "./DeleteWorkModal";
import { Modal as ModalBS } from "react-bootstrap";
import { LoginModal } from "./LoginModal";

export const Modal = () => {
  const { open, view } = useSnapshot(ModalStore.state);

  return (
    <ModalBS centered show={open} onHide={() => ModalStore.close()}>
      {view === "DeleteWorkModal" && <DeleteWorkModal />}
      {view === "LoginModal" && <LoginModal />}
    </ModalBS>
  );
};
