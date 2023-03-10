// @flow
import * as React from "react";
import { PriceResponse, useMinterPrice } from "../../hooks/useMinterPrice";
import { fromCoin, fromTimestamp } from "../../hooks/useUpdateDutchAuction";
import { useEffect, useState } from "react";

type Props = {
  minter?: string | null;
};
export const MintPrice = ({ minter }: Props) => {
  const minterPrice = useMinterPrice({ minter });

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
        <div>
          <div>Current Auction price: {fromCoin(current_price)}</div>
          <div>
            The auction is complete. The resting price is{" "}
            {fromCoin(d.auction_rest_price)}
          </div>
        </div>
      );
    }
    return (
      <div>
        <>
          <div>Current Auction price: {fromCoin(current_price)}</div>
          <div>
            <>
              {" "}
              Next Price change:{" "}
              {Math.round(
                (fromTimestamp(auction_next_price_timestamp).getTime() -
                  new Date().getTime()) /
                  1000
              )}
            </>
          </div>
          <div>
            Auction end time: {fromTimestamp(auction_end_time).toISOString()}
          </div>
        </>
      </div>
    );
  }

  return (
    <div>
      <>Current Fixed price: {d.current_price}</>
    </div>
  );
};
