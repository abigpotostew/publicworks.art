// @flow
import * as React from "react";
import { Button, Modal } from "react-bootstrap";
import ModalStore from "../../modal/ModalStore";
import { trpcNextPW } from "../../server/utils/trpc";
import { useMutation } from "@tanstack/react-query";
import SpinnerLoading from "../loading/Loader";
import { useClientLoginMutation } from "../../hooks/useClientLoginMutation";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export const LoginModal = () => {
  const login = useClientLoginMutation();
  const loginAndClose = useMutation({
    mutationFn: async () => {
      await login.mutateAsync();
      ModalStore.close();
    },
  });
  return (
    <div>
      <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        After clicking Login, keplr will request a signature from you that is
        used to verify ownership of your wallet.
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          disabled={loginAndClose.isPending}
          onClick={() => loginAndClose.mutate()}
        >
          Login {loginAndClose.isPending ? <SpinnerLoading /> : ""}
        </Button>
      </Modal.Footer>
    </div>
  );
};
