// @flow
import * as React from "react";
import { FC, useCallback } from "react";
import { WorkSerializable } from "@publicworks/db-typeorm/serializable";
import * as Dialog from "@radix-ui/react-dialog";
import { useWallet } from "../../../@stargazezone/client";
import { Button } from "react-bootstrap";
import { TooltipInfo } from "../tooltip";
import chainInfo from "../../stargaze/chainInfo";

interface ConfirmInstantiateModalI {
  work: WorkSerializable;
  instantiatePending: boolean;
  onConfirm: () => void;
  open: boolean;
  setOpen: (isOpen: boolean) => void;
}

export const ConfirmInstantiateModal: FC<ConfirmInstantiateModalI> = ({
  work,
  instantiatePending,
  onConfirm,
  open,
  setOpen,
}) => {
  const sgwallet = useWallet();

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <div className={"flex flex-row gap-2 items-center"}>
          <Button
            disabled={
              !sgwallet.wallet?.address ||
              instantiatePending ||
              (!!work.sg721 && !chainInfo().testnet)
            }
            variant={work.sg721 ? "danger" : "primary"}
          >
            {!!work && !work.sg721 && <span>Publish On Chain</span>}

            {!!work && !!work.sg721 && chainInfo().testnet && (
              <span>
                Create New Collection{" "}
                <TooltipInfo>
                  Your contract is already deployed. Instantiating it again will
                  create a copy of your collection on stargaze.
                </TooltipInfo>
              </span>
            )}
            {!!work && !!work.sg721 && !chainInfo().testnet && (
              <span>Publish On Chain</span>
            )}
          </Button>
          {!!work && !!work.sg721 && !chainInfo().testnet && (
            <TooltipInfo>
              Your collection is already deployed so it cannot be published
              again. But you can update the price on the next step.
            </TooltipInfo>
          )}
        </div>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay
          className={
            "fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm"
          }
        />
        <Dialog.Content
          className={
            "fixed inset-0 z-10 w-screen overflow-y-auto flex items-center justify-center p-0 sm:p-0 sm:items-start sm:justify-start"
          }
        >
          <div
            className={
              "relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 w-full  sm:max-w-lg sm:p-6"
            }
          >
            <Dialog.Title>Publish collection</Dialog.Title>
            <Dialog.Description>
              {work.sg721 ? (
                <>
                  Your collection is already deployed. Deploying again will
                  replace the existing collection on this site, but will also
                  still exist on chain. This is not possible on mainnet but is
                  provided as a convenience for testnet.
                </>
              ) : null}
              {!work.sg721 ? (
                <>
                  Are you sure you want to publish your work on chain? Most
                  parameters are not configurable after this action. You can
                  only change price. Verify all details are correct before
                  confirming.
                </>
              ) : null}
            </Dialog.Description>
            <div className={"flex flex-row gap-1 justify-end"}>
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
