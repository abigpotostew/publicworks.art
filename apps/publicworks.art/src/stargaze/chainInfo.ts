import { ChainInfos, ChainInfoWithExplorer } from "src/stargaze/config";

const chainInfo = (): ChainInfoWithExplorer => {
  switch (process?.env?.NEXT_PUBLIC_TESTNET) {
    case "true":
      return ChainInfos[3];
    default:
      return ChainInfos[1];
  }
};

export default chainInfo;
