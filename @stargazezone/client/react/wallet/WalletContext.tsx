import React from "react";
import { WalletInfo } from "@stargazezone/client";

export type WalletContextValue = {
  wallet?: WalletInfo;
  login: () => Promise<WalletInfo | null>;
  logout: () => void;
  refreshBalance: () => void;
  loading: boolean | undefined;
};

const WalletContext = React.createContext<WalletContextValue>({
  wallet: undefined,
  login: () => Promise.resolve(null),
  logout: () => {},
  refreshBalance: () => {},
  loading: undefined,
});
export default WalletContext;
