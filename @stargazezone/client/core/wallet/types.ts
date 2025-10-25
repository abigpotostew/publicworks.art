import type { Coin } from "@cosmjs/proto-signing";

export type WalletInfo = {
  address: string;
  name?: string;
  balance?: Coin;
};
