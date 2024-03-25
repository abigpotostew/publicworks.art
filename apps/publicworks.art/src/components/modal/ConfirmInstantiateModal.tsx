// @flow
import * as React from "react";
import { FC, useCallback } from "react";
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
  const [open, setOpenState] = React.useState(false);
  const setOpen = useCallback(
    (isOpen: boolean) => {
      if (instantiatePending) {
        return;
      }
      setOpenState(isOpen);
    },
    [instantiatePending]
  );

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
        <Dialog.Overlay
          className={
            "tw-fixed tw-inset-0 tw-bg-gray-500 tw-bg-opacity-75 tw-transition-opacity tw-backdrop-blur-sm"
          }
        />
        <Dialog.Content
          className={
            "tw-fixed tw-inset-0 tw-z-10 tw-w-screen tw-overflow-y-auto tw-flex tw-items-center tw-justify-center tw-p-0 sm:tw-p-0 tw-sm:tw-items-start tw-sm:tw-justify-start"
          }
        >
          <div
            className={
              "tw-relative tw-transform tw-overflow-hidden tw-rounded-lg tw-bg-white tw-px-4 tw-pb-4 tw-pt-5 tw-text-left tw-shadow-xl tw-transition-all sm:tw-my-8 tw-w-full  sm:tw-max-w-lg sm:tw-p-6"
            }
          >
            <Dialog.Title>Deploy contract</Dialog.Title>
            <Dialog.Description>
              {!!work.sg721 ? (
                <>
                  Your collection is already deployed. Deploying again will
                  replace the existing collection on this site, but the existing
                  collection will still exist on chain. This is not recommended.
                </>
              ) : null}
              {!work.sg721 ? (
                <>
                  Are you sure you want to deploy your work on chain? Most
                  parameters are not configurable after this action. You can
                  only change price. Verify all details are correct before
                  confirming.
                </>
              ) : null}
            </Dialog.Description>
            <div className={"tw-flex tw-flex-row tw-gap-1 tw-justify-end"}>
              <Button
                variant={"primary"}
                disabled={instantiatePending}
                onClick={() => onConfirm()}
              >
                Deploy
              </Button>
              <Button
                variant={"outline-secondary"}
                disabled={instantiatePending}
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
