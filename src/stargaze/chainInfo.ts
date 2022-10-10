import { ChainInfo } from "@keplr-wallet/types/build/chain-info";
import { ChainInfos } from "src/stargaze/config";

let chainInfo: ChainInfo;
switch (process?.env?.NEXT_PUBLIC_TESTNET) {
  case "true":
    chainInfo = ChainInfos[3];
    break;
  default:
    chainInfo = ChainInfos[1];
}

export default chainInfo;
