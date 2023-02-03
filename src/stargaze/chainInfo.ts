import { ChainInfos, ChainInfoWithExplorer } from "src/stargaze/config";

let chainInfo: ChainInfoWithExplorer;
switch (process?.env?.NEXT_PUBLIC_TESTNET) {
  case "true":
    chainInfo = ChainInfos[3];
    break;
  default:
    chainInfo = ChainInfos[1];
}

export default chainInfo;
