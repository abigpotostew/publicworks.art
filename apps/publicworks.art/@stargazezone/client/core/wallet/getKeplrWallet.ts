import { getKeplrFromWindow } from "@keplr-wallet/stores";

import { WalletInfo } from "./types";
import { ChainInfo } from "@keplr-wallet/types";

export default async function getKeplrWallet(
  chainId: string,
  chainInfo?: ChainInfo
): Promise<WalletInfo | null> {
  const keplr = await getKeplrFromWindow();

  if (!keplr) {
    return null;
  }
  // @ts-ignore
  if (window.keplr) {
    // @ts-ignore
    window.keplr.defaultOptions = {
      sign: {
        preferNoSetFee: true,
      },
    };
  }
  if (chainInfo) {
    await keplr.experimentalSuggestChain(chainInfo);
    await keplr.enable(chainInfo.chainId);
  }

  const walletInfo = await keplr.getKey(chainId);

  return {
    address: walletInfo.bech32Address,
    name: walletInfo.name,
  };
}
