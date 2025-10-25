// Careful to only import types -- and not heavy code here.
import type { Config as WhitelistConfig } from "@stargazezone/types/contracts/whitelist/config";
import type { Collection } from "../collections/types";
import { Timestamp } from "@stargazezone/types/contracts/sg721/shared-types";
export interface Coin {
  denom: string;
  amount: string;
}

export type DutchAuctionConfig = {
  end_time: Timestamp;
  resting_unit_price: Coin;
  decline_period_seconds: number;
  decline_decay: number;
};

export type SaleConfig = {
  admin?: string;
  base_token_uri: string;
  num_tokens: number;
  per_address_limit: number;
  sg721_address: string;
  sg721_code_id: number;
  start_time?: string;
  unit_price: Coin;
  whitelist?: string;
  dutch_auction_config?: DutchAuctionConfig | null;
};

export interface Minter {
  // Collection Metadata
  contractAddress: string;
  collection: Collection;
  config: SaleConfig;
  // Sale contract info
  whitelistInfo?: WhitelistConfig;
  percentMinted?: number;
}

export type GetMintersOptions = {
  includeWhitelist?: boolean;
  includePercentMinted?: boolean;
  exclude?: string[];
};
