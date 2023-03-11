import config from "../wasm/config";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { fromTimestamp } from "./useUpdateDutchAuction";

/**
 * {"data":{"public_price":{"denom":"ustars","amount":"50000000"},"whitelist_price":null,"current_price":{"denom":"ustars","amount":"50000000"},"auction_rest_price":null,"auction_end_time":null,"auction_next_price_timestamp":null}}
 * @param minter
 */
const d = {
  data: {
    public_price: { denom: "ustars", amount: "50000000" },
    whitelist_price: null,
    current_price: { denom: "ustars", amount: "50000000" },
    auction_rest_price: null,
    auction_end_time: null,
    auction_next_price_timestamp: null,
  },
};

const amountZod = z.object({
  denom: z.string(),
  amount: z.string(),
});
const dutchAuctionPriceZod = z.object({
  rest_price: amountZod,
  end_time: z.string(),
  next_price_timestamp: z.string(),
});
const getPriceInnerZod = z.object({
  public_price: amountZod,
  current_price: amountZod,
  whitelist_price: amountZod.nullish(),
  dutch_auction_price: dutchAuctionPriceZod.nullish(),
});
const getPriceResponseZod = z.object({
  data: getPriceInnerZod,
});

export type PriceResponse = z.infer<typeof getPriceInnerZod>;
export type DutchAuctionPriceResponse = z.infer<typeof dutchAuctionPriceZod>;

export const fetchMinterPrice = async (
  minter: string
): Promise<PriceResponse> => {
  const msgBase64 = Buffer.from(JSON.stringify({ mint_price: {} })).toString(
    "base64"
  );
  const res = await fetch(
    `${config.restEndpoint}/cosmwasm/wasm/v1/contract/${minter}/smart/${msgBase64}`
  );
  if (!res.ok) {
    const msg =
      "failed to get mint price" +
      res.status +
      ", " +
      (await res.text().toString());
    console.log(msg);
    throw new Error(msg);
  }
  const parsed = getPriceResponseZod.safeParse(await res.json());
  if (!parsed.success) {
    console.log("parsed.error", parsed.error);
    throw new Error("failed to parse response");
  }
  const out = parsed.data.data;

  return out;
};

export const useMinterPrice = ({ minter }: { minter?: string | null }) => {
  const [auctionLive, setAuctionLive] = useState(false);

  return useQuery(
    [`get-minter-price-${config.restEndpoint}-${minter}`],
    async (): Promise<PriceResponse | null> => {
      if (!minter) {
        return null;
      }
      const out = await fetchMinterPrice(minter);
      if (out.dutch_auction_price) {
        const auctionLive =
          fromTimestamp(out.dutch_auction_price.end_time).getTime() >
          new Date().getTime();
        setAuctionLive(auctionLive);
        console.log("auctionLive", auctionLive);
      }
      return out;
    },
    {
      refetchInterval: auctionLive ? 1000 : 1000 * 10,
      refetchOnWindowFocus: true,
      enabled: !!minter,
    }
  );
};
