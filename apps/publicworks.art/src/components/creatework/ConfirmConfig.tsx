import { FC, useCallback, useState } from "react";
import { WorkSerializable } from "@publicworks/db-typeorm/serializable";
import { Col, Container, Form, Row } from "react-bootstrap";
import styles from "./ConfirmConfig.module.css";
import { FlexBox } from "../layout/FlexBoxCenter";
import { RowWideContainer } from "../layout/RowWideContainer";
import { LiveMedia } from "../media/LiveMedia";
import { generateTxHash } from "src/generateHash";
import { BsArrowRepeat } from "react-icons/bs";
import { CreateLayout } from "./CreateLayout";
import { TooltipInfo } from "../tooltip";
import { ButtonPW as Button } from "../button/Button";
import { useWallet } from "../../../@stargazezone/client";
import { useInstantiate } from "../../hooks/useInstantiate";

interface ConfirmConfigProps {
  work: WorkSerializable;
  setUseSimulatedGasFee: (useSimulatedGasFee: boolean) => void;
  onInstantiate: () => void;
}

export const ConfirmConfig: FC<ConfirmConfigProps> = (
  props: ConfirmConfigProps
) => {
  const w = props.work;

  type Mapping = Record<keyof WorkSerializable, string | null>;
  const whenDutchAuction = (label: string) => {
    return w.isDutchAuction ? label : null;
  };
  const pairs: Mapping = {
    name: "Name",
    description: "Description",
    blurb: "Blurb",
    additionalDescription: "Additional Description",
    externalLink: "External Link",
    maxTokens: "Collection Size",
    priceStars: "Price $STARS",
    isDutchAuction: "Dutch Auction Enabled",
    dutchAuctionEndDate: whenDutchAuction("Dutch Auction End Time"),
    dutchAuctionEndPrice: whenDutchAuction("Dutch Auction End Price"),
    dutchAuctionDeclinePeriodSeconds: whenDutchAuction("Price Drop Interval"),
    dutchAuctionDecayRate: whenDutchAuction("Price Decay Rate"),
    royaltyAddress: "Royalty Receiver",
    royaltyPercent: "Royalty Percent",
    resolution: "Resolution",
    pixelRatio: "Pixel Ratio",
    selector: "CSS Selector",
    license: "License",
    id: null,
    codeCid: "Code IPFS CID",
    coverImageCid: null,
    creator: "Creator",
    slug: null,
    sg721: null,
    minter: null,
    startDate: "Start Date",
    createdDate: null,
    updatedDate: null,
    hidden: null,
    ownerAddress: null,
    sg721CodeId: null,
    minterCodeId: null,
  };
  const sgwallet = useWallet();
  const { instantiateMutation } = useInstantiate();

  //https://react-bootstrap.netlify.app/forms/layout/#horizontal-form-label-sizing
  return (
    <div className={"tw-pb-24 tw-flex tw-justify-center"}>
      <CreateLayout codeCid={props.work.codeCid} hideLiveMedia={false}>
        <h2 className={"tw-pt-4 tw-px-4"}>Confirm Collection Configuration</h2>
        <>
          <div className={"tw-p-4"}>
            {Object.keys(pairs)
              .filter((k) => !!pairs[k as keyof WorkSerializable])
              .map((k) => {
                return (
                  <Row key={k}>
                    <Form.Group>
                      <Form.Label
                        column="sm"
                        lg={12}
                        className={`${styles.labelTitle} tw-text-sm tw-text-gray-500`}
                      >
                        {pairs[k as keyof WorkSerializable]}
                      </Form.Label>
                      <Form.Label className={"tw-pt-0"} column="lg" size="sm">
                        {w[k as keyof WorkSerializable]?.toString()}
                      </Form.Label>
                    </Form.Group>
                  </Row>
                );
              })}
            <div className={"tw-flex tw-flex-row tw-gap-2 tw-items-center"}>
              <Button
                disabled={
                  !!props.work.sg721 ||
                  !sgwallet.wallet?.address ||
                  instantiateMutation.isLoading
                }
                onClick={() => props.onInstantiate()}
                variant={props.work.sg721 ? "danger" : "primary"}
              >
                {props.work && (
                  <>
                    <span>Publish On Chain</span>{" "}
                  </>
                )}
              </Button>
              {!props.work.sg721 && (
                <TooltipInfo>
                  Many configurations cannot be changed after publish. Please
                  review your configuration carefully before publishing.
                </TooltipInfo>
              )}
              {!!props.work.sg721 && (
                <TooltipInfo>
                  Your collection is already published on chain. But you can
                  change the price on the next step.
                </TooltipInfo>
              )}
            </div>
          </div>
        </>
      </CreateLayout>
    </div>
  );
};
