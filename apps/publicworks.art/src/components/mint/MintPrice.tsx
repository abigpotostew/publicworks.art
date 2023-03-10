// @flow
import * as React from "react";
import { PriceResponse, useMinterPrice } from "../../hooks/useMinterPrice";
import { fromCoin, fromTimestamp } from "../../hooks/useUpdateDutchAuction";
import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useSoldOut } from "../../hooks/useSoldOut";
import { WorkSerializable } from "@publicworks/db-typeorm/serializable";

type Props = {
  minter?: string | null;
  work?: WorkSerializable | null;
};
export const MintPrice = ({ minter, work }: Props) => {
  const soldOutQuery = useSoldOut(work);
  const minterPrice = useMinterPrice({ minter });

  const isSoldOut = soldOutQuery.data === true;

  const [data, setData] = useState<PriceResponse | null>(
    minterPrice.data || null
  );

  useEffect(() => {
    setData(minterPrice.data || null);
  }, [minterPrice.data, minterPrice.dataUpdatedAt]);

  if (!data) {
    return <div>Loading...</div>;
  }
  const d = data;

  if (
    d.auction_end_time &&
    d.auction_next_price_timestamp &&
    d.auction_rest_price
  ) {
    const auctionLive =
      fromTimestamp(d.auction_end_time).getTime() > new Date().getTime();
    const { current_price, auction_next_price_timestamp, auction_end_time } = d;
    if (!auctionLive) {
      return (
        <Card>
          <Card.Body>
            {" "}
            {/*<Card.Header></Card.Header>*/}
            <Card.Title>Price: {fromCoin(current_price)} STARS</Card.Title>
            <Card.Text>
              The auction is complete. The resting price is{" "}
              {fromCoin(d.auction_rest_price)}
            </Card.Text>
          </Card.Body>
        </Card>
      );
    }

    return (
      <div>
        <Card>
          <Card.Body>
            {" "}
            {/*<Card.Header></Card.Header>*/}
            <Card.Title>Price: {fromCoin(current_price)} STARS</Card.Title>
            <Card.Text>
              Next Price change:{" "}
              {Math.round(
                (fromTimestamp(auction_next_price_timestamp).getTime() -
                  new Date().getTime()) /
                  1000
              )}
              Auction end time: {fromTimestamp(auction_end_time).toISOString()}
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <>Current Fixed price: {d.current_price}</>
    </div>
  );
};
