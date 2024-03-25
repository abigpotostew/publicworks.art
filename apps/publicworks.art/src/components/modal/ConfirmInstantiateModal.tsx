// @flow
import * as React from "react";
import { FC } from "react";
import { WorkSerializable } from "@publicworks/db-typeorm/serializable";
import * as Dialog from "@radix-ui/react-dialog";
import { useWallet } from "../../../@stargazezone/client";
import { Button } from "react-bootstrap";
import { TooltipInfo } from "../tooltip";

interface ConfirmInstantiateModalI {
  work: WorkSerializable;
  instantiatePending: boolean;
  onConfirm: () => void;
}

export const ConfirmInstantiateModal: FC<ConfirmInstantiateModalI> = ({
  work,
  instantiatePending,
  onConfirm,
}) => {
  const sgwallet = useWallet();
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button
          disabled={!sgwallet.wallet?.address || instantiatePending}
          variant={work.sg721 ? "danger" : "primary"}
        >
          {work && !work.sg721 && <span>Instantiate On Chain</span>}
          {work && work.sg721 && (
            <span>
              Create New Collection{" "}
              <TooltipInfo>
                Your contract is already deployed. Instantiating it again will
                create a new collection on chain!
              </TooltipInfo>
            </span>
          )}
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={""} />
        <Dialog.Content
          className={
            "tw-fixed tw-inset-0 tw-z-10 tw-w-screen tw-overflow-y-auto"
          }
        >
          <div
            className={
              "tw-relative tw-transform tw-overflow-hidden tw-rounded-lg tw-bg-white tw-px-4 tw-pb-4 tw-pt-5 tw-text-left tw-shadow-xl tw-transition-all sm:tw-my-8 sm:tw-w-full sm:tw-max-w-lg sm:tw-p-6"
            }
          >
            <Dialog.Title>Deploy contract on chain</Dialog.Title>
            <Dialog.Description>Are you sure!?</Dialog.Description>
            <Dialog.Close />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
