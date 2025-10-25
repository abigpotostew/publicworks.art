// re-export PURE types, functions, and classes here. (don't accidentally import heavy libraries here)

import { StargazeClient } from "./core";
import StargazeProvider from "./react/client/StargazeProvider";
import useStargazeClient from "./react/client/useStargazeClient";
import useWallet from "./react/wallet/useWallet";

export type { Collection } from "./core/collections/types";
export type { Coin, Minter, SaleConfig } from "./core/minters/types";
export type { WalletInfo } from "./core/wallet/types";

// React stuff
export { StargazeProvider, useWallet, useStargazeClient };

export { StargazeClient };
