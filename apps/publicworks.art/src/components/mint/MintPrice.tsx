// @flow
import * as React from "react";
import {
  DutchAuctionPriceResponse,
  PriceResponse,
  useMinterPrice,
} from "../../hooks/useMinterPrice";
import { fromCoin, fromTimestamp } from "../../hooks/useUpdateDutchAuction";
import { useEffect, useState } from "react";
import { Button, Card, Placeholder, Table } from "react-bootstrap";
import { useSoldOut } from "../../hooks/useSoldOut";
import { WorkSerializable } from "@publicworks/db-typeorm/serializable";
import { MintToken } from "./MintToken";
import config from "../../wasm/config";
import { useMinter } from "../../hooks/wasm/useMinter";
import { Minter } from "../../../@stargazezone/client";
import Countdown from "react-countdown";
import { GrowingDot } from "../spinner/GrowingDot";
import { generatePrices } from "../../lib/dutch-auction/prices";

const DutchAuctionPriceInfo = ({
  work,
  da,
  minter,
}: {
  work: WorkSerializable;
  da: DutchAuctionPriceResponse;
  minter: Minter;
}) => {
  const { prices, labels } = generatePrices({
    decay: (minter.config.dutch_auction_config?.decline_decay || 0) / 1_000_000,
    startPrice: fromCoin(minter.config.unit_price),
    endPrice: fromCoin(da.rest_price),
    endTime: fromTimestamp(da.end_time),
    startTime: fromTimestamp(minter.config.start_time || "0"),
    declinePeriodSeconds:
      minter.config.dutch_auction_config?.decline_period_seconds || 0,
  });

  const beforeEndOfAuction =
    fromTimestamp(da.end_time).getTime() > new Date().getTime();
  const afterStartOfAuction =
    (minter.config.start_time
      ? fromTimestamp(minter.config.start_time).getTime()
      : Date.now()) < new Date().getTime();
  const auctionBefore = beforeEndOfAuction && !afterStartOfAuction;
  const auctionOver = !beforeEndOfAuction;
  console.log("auctionOver,pizza", auctionOver);
  const auctionDuring = beforeEndOfAuction && afterStartOfAuction;

  const nextPriceChangeSeconds = Math.round(
    (fromTimestamp(da.next_price_timestamp).getTime() - new Date().getTime()) /
      1000
  );

  // const activePrices = prices.findIndex((p) => p.time.getTime() > Date.now());
  // const pricesToShow = prices.slice(activePrices, activePrices + 5);
  // const labelsToShow = labels.slice(activePrices, activePrices + 5);

  return (
    <div>
      {auctionOver && (
        <Card.Text>
          The auction is complete. The resting price is{" "}
          {fromCoin(da.rest_price)}
        </Card.Text>
      )}
      {auctionBefore && (
        <Card.Text>
          Auction starts in:{" "}
          <Countdown
            date={fromTimestamp(da.next_price_timestamp)}
            key={da.next_price_timestamp}
            renderer={({
              formatted: {
                days: daysFmt,
                hours: hoursFmt,
                minutes: minutesFmt,
                seconds: secondsFmt,
              },
              days,
              hours,
              minutes,
              seconds,
            }) => (
              <span>{`${days > 0 ? `${daysFmt}d` : ""}${
                hours > 0 ? `${hoursFmt}h` : ""
              }${minutes > 0 ? `${minutesFmt}m` : ""}${secondsFmt}s`}</span>
            )}
          />
        </Card.Text>
      )}
      {auctionDuring && (
        <>
          <Card.Text>
            Next Price change:{" "}
            <Countdown
              date={fromTimestamp(da.next_price_timestamp)}
              key={da.next_price_timestamp}
              renderer={({
                formatted: {
                  days: daysFmt,
                  hours: hoursFmt,
                  minutes: minutesFmt,
                  seconds: secondsFmt,
                },
                days,
                hours,
                minutes,
                seconds,
              }) => {
                if (nextPriceChangeSeconds < 0) {
                  return (
                    <span>
                      {`00s `}
                      <GrowingDot className={"text-warning"} />
                    </span>
                  );
                }
                return (
                  <span>{`${days > 0 ? `${daysFmt}d` : ""}${
                    hours > 0 ? `${hoursFmt}h` : ""
                  }${minutes > 0 ? `${minutesFmt}m` : ""}${secondsFmt}s`}</span>
                );
              }}
            />
          </Card.Text>

          {/*<Card.Text>*/}
          {/*  Auction end time: {fromTimestamp(da.end_time).toISOString()}*/}
          {/*</Card.Text>*/}
        </>
      )}
      {!auctionOver && (
        <div className={"overflow-scroll p-0"}>
          <Table striped="columns" className={"mb-0 p-0"}>
            <tbody>
              <tr>
                {new Array(prices.length + 1).fill(0).map((_, i) => {
                  if (i === 0) {
                    return (
                      <td key={i} className={"small"}>
                        {"Price"}
                      </td>
                    );
                  } else {
                    const past = prices[i - 1].time.getTime() < Date.now();

                    const ended =
                      prices[i - 1].time.getTime() +
                        (minter.config.dutch_auction_config
                          ?.decline_period_seconds || 0) *
                          1000 <
                      Date.now();
                    const classname = ended
                      ? "text-secondary"
                      : past && !ended
                      ? "text-success"
                      : "";
                    return (
                      <td key={i}>
                        <span className={classname}>{prices[i - 1].price}</span>
                      </td>
                    );
                    // if (past && currentPeriod) {
                    //
                    // }
                    // return <td key={i}>{prices[i - 1].price}</td>;
                  }
                })}
              </tr>
              <tr>
                {new Array(labels.length + 1).fill(0).map((_, i) => {
                  if (i === 0) {
                    return (
                      <td key={i} className={"Width-7 block"}>
                        <span className={"small"}>Elapsed Time</span>
                      </td>
                    );
                  } else {
                    const past = prices[i - 1].time.getTime() < Date.now();
                    const ended =
                      prices[i - 1].time.getTime() +
                        (minter.config.dutch_auction_config
                          ?.decline_period_seconds || 0) *
                          1000 <
                      Date.now();
                    const classname = ended
                      ? "text-secondary"
                      : past && !ended
                      ? "text-success"
                      : "";
                    return (
                      <td key={i}>
                        <span className={classname}>{labels[i - 1]}</span>
                      </td>
                    );
                  }
                })}
              </tr>
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};
type Props = {
  minter?: string | null;
  work?: WorkSerializable | null;
  className?: string;
};
//todo preload some of this shit for hydration
export const MintPrice = ({ minter, work, className }: Props) => {
  const soldOutQuery = useSoldOut(work);
  const minterPrice = useMinterPrice({ minter });
  const minterQuery = useMinter(work?.minter);

  const isSoldOut = soldOutQuery.data === true;

  const [data, setData] = useState<PriceResponse | null>(
    minterPrice.data || null
  );

  useEffect(() => {
    setData(minterPrice.data || null);
  }, [minterPrice.data, minterPrice.dataUpdatedAt]);

  if (!data) {
    return (
      <Card className={className}>
        <Card.Body>
          <Placeholder as={Card.Text} animation="glow">
            <Placeholder xs={4} /> <Placeholder xs={4} />
            <Placeholder xs={2} /> <Placeholder xs={10} />
            <Placeholder xs={5} /> <Placeholder xs={6} />
          </Placeholder>
          <hr />
          <Placeholder as={Card.Text} animation="glow">
            <Placeholder xs={2} /> <Placeholder xs={2} />{" "}
            <Placeholder.Button xs={7} variant="primary" />
          </Placeholder>
        </Card.Body>
      </Card>
    );
  }

  const d = data;

  const isDutchAuction = !!d.dutch_auction_price;

  const auctionLive =
    isDutchAuction &&
    d.dutch_auction_price?.end_time &&
    fromTimestamp(d.dutch_auction_price?.end_time).getTime() >
      new Date().getTime();
  const { current_price } = d;
  const priceChangeImminent =
    auctionLive && d.dutch_auction_price
      ? Math.round(
          (fromTimestamp(d.dutch_auction_price.next_price_timestamp).getTime() -
            new Date().getTime()) /
            1000
        ) < 10
      : false;
  // priceChangeImminent = true;
  const priceChangeImminentD = (
    <GrowingDot className={"text-success"} />
    // <div
    //   //todo make this green always.
    //   // move the yellow one down to the rpice change counter
    //   className="spinner-grow text-warning"
    //   role="status"
    //   style={{ width: "1.25rem", height: "1.25rem" }}
    // >
    //   <span className="sr-only"></span>
    // </div>
  );
  const renderDutchAuction =
    !isSoldOut && !!work && !!d.dutch_auction_price && !!minterQuery.data;

  return (
    <Card className={className}>
      <Card.Body>
        <Card.Title>
          Price: {fromCoin(current_price)} STARS{" "}
          {/*{priceChangeImminent && priceChangeImminentD}*/}
        </Card.Title>
        {isSoldOut && <Card.Text>Sold out.</Card.Text>}
        {!isSoldOut &&
          !!work &&
          !!d.dutch_auction_price &&
          !!minterQuery.data && (
            <DutchAuctionPriceInfo
              work={work}
              da={d.dutch_auction_price}
              minter={minterQuery.data}
            />
          )}
        <hr />
        {!!work && <MintToken work={work} />}

        {!work && (
          <Placeholder as={Card.Text} animation="glow">
            <Placeholder xs={6} />
          </Placeholder>
        )}
      </Card.Body>
    </Card>
  );
  //
  // //live auction
  // return (
  //   <div>
  //     <Card>
  //       <Card.Body>
  //         {" "}
  //         {/*<Card.Header></Card.Header>*/}
  //         <Card.Title>Price: {fromCoin(current_price)} STARS</Card.Title>
  //         <Card.Text>
  //           Next Price change:{" "}
  //           {Math.round(
  //             (fromTimestamp(auction_next_price_timestamp).getTime() -
  //               new Date().getTime()) /
  //               1000
  //           )}
  //           Auction end time: {fromTimestamp(auction_end_time).toISOString()}
  //         </Card.Text>
  //       </Card.Body>
  //     </Card>
  //   </div>
  // );

  // return (
  //   <div>
  //     <>Current Fixed price: {d.current_price}</>
  //   </div>
  // );
};
