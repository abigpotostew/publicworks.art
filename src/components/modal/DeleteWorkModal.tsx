// @flow
import * as React from "react";
import { Button, Modal } from "react-bootstrap";
import ModalStore from "../../modal/ModalStore";
import { trpcNextPW } from "../../server/utils/trpc";
import { useMutation } from "@tanstack/react-query";
import SpinnerLoading from "../loading/Loader";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export const DeleteWorkModal = () => {
  const work = ModalStore.state.data?.work;

  const deleteWork = trpcNextPW.works.deleteWork.useMutation();
  const deleteWorkAndClose = useMutation(async () => {
    if (work?.id) {
      await deleteWork.mutateAsync({ workId: work?.id });
    }
    ModalStore.close();
  });

  return (
    <div>
      <Modal.Header closeButton>
        <Modal.Title>Delete Work</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete {work?.name}? This cannot be undone.
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          disabled={deleteWork.isLoading}
          onClick={() => ModalStore.close()}
        >
          Close
        </Button>
        <Button
          variant="danger"
          disabled={deleteWork.isLoading}
          onClick={() => deleteWorkAndClose.mutate()}
        >
          Delete {deleteWork.isLoading ? <SpinnerLoading /> : ""}
        </Button>
      </Modal.Footer>
    </div>
  );
};
