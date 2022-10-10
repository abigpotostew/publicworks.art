import { useContext } from "react";
import WalletContext from "./WalletContext";

export default function useWallet() {
  const value = useContext(WalletContext);
  return value;
}
