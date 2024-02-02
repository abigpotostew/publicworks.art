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
import { z } from "zod";
import { formatInTimeZone } from "date-fns-tz";
import { format } from "date-fns";
import { formatInUTC } from "./NftDetails2";

interface ConfirmConfigProps {
  work: WorkSerializable;
  setUseSimulatedGasFee: (useSimulatedGasFee: boolean) => void;
  onInstantiate: () => void;
}

const isDateString = (date: string) => {
  return z.string().datetime().safeParse(date).success;
};
const getDate = (date: string) => {
  return new Date(date);
};
export const formatInLocalTimezone = (date: Date | null | undefined) => {
  if (!date) {
    return "-";
  }
  try {
    const out = format(date, "LLLL d, yyyy kk:mm"); // 2014-10-25 06:46:20-04:00
    return out;
  } catch (e) {
    return "-";
  }
};

const ValueRender = ({
  work,
  k,
}: {
  work: WorkSerializable;
  k: keyof WorkSerializable;
}) => {
  const value = work[k];
  if (typeof value === "string" && isDateString(value)) {
    const date = getDate(value);
    return (
      <>
        <div className={"tw-flex tw-flex-col"}>
          <span>{formatInLocalTimezone(date)}</span>
          <span className={"tw-text-sm"}> ({formatInUTC(date)} UTC)</span>
        </div>
      </>
    );
  }
  return <>{work[k]?.toString()}</>;
};
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
    royaltyAddress: "Primary and secondary sales payout address",
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

  console.log("work is ", w);
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
                        <ValueRender work={w} k={k as keyof WorkSerializable} />
                      </Form.Label>
                    </Form.Group>
                  </Row>
                );
              })}
            <div>
              <Button
                disabled={
                  !sgwallet.wallet?.address || instantiateMutation.isLoading
                }
                onClick={() => props.onInstantiate()}
                variant={props.work.sg721 ? "danger" : "primary"}
              >
                {props.work && !props.work.sg721 && (
                  <span>Instantiate On Chain</span>
                )}
                {props.work && props.work.sg721 && (
                  <span>
                    Instantiate + Replace Chain{" "}
                    <TooltipInfo>
                      Your contract is already deployed. Instantiating it again
                      will replace the old instance on publicworks.art and
                      remove all tokens
                    </TooltipInfo>
                  </span>
                )}
              </Button>
            </div>
          </div>
        </>
      </CreateLayout>
    </div>
  );
};
