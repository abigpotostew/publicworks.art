import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { Config } from "../config";
import { Window } from "@keplr-wallet/types/build/window";
import { addTestnetToKeplr } from "./keplr-testnet";
import { GasPrice } from "cosmwasm";
import { OfflineDirectSigner, OfflineSigner } from "@cosmjs/proto-signing";

export interface KeplrClient {
  offlineSigner: OfflineSigner | OfflineDirectSigner;
  signer: SigningCosmWasmClient;
}

export const keplrClient = async (config: Config): Promise<KeplrClient> => {
  const prefix = "wasm";
  const gasPrice = GasPrice.fromString("0ustars");

  // hack foo to wait for keplr to be available
  await new Promise((r) => setTimeout(r, 200));

  // check browser compatibility

  const checkChainOrTestnet = async () => {
    if (config.testnet) {
      const testnet = await addTestnetToKeplr();
      console.log("enabled testnet", testnet);
    } else {
      const windowKeplr = <Window>window;

      const chain = await windowKeplr.keplr?.enable(config.chainId);
    }
    console.log("enabled checkChainOrTestnet");
  };

  await checkChainOrTestnet();
  const windowKeplr = <Window>window;
  if (windowKeplr.getOfflineSignerAuto) {
    // Setup signer
    const offlineSigner = await windowKeplr.getOfflineSignerAuto(
      config.chainId
    );
    // Init SigningCosmWasmClient client
    return {
      signer: await SigningCosmWasmClient.connectWithSigner(
        config.rpcEndpoint,
        offlineSigner,
        {
          prefix,
          //@ts-ignore
          // gasPrice,
          gasPrice: new GasPrice(1),
        }
      ),
      offlineSigner,
    };
  } else {
    throw Error("Keplr not available");
  }
};
