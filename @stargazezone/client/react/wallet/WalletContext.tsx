import React from "react";
import { WalletInfo } from "@stargazezone/client";

export type WalletContextValue = {
  wallet?: WalletInfo;
  login: () => void;
  logout: () => void;
  refreshBalance: () => void;
  loading: boolean | undefined;
};

const WalletContext = React.createContext<WalletContextValue>({
  wallet: undefined,
  login: () => {},
  logout: () => {},
  refreshBalance: () => {},
  loading: undefined,
});
export default WalletContext;
