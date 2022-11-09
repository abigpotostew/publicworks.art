import { Bech32Address } from "@keplr-wallet/cosmos";
import { ChainInfo } from "@keplr-wallet/types";

export interface ChainInfoWithExplorer extends ChainInfo {
  // Formed as "https://explorer.com/{txHash}"
  explorerUrlToTx: string;
}

export const ChainInfos: ChainInfoWithExplorer[] = [
  {
    rpc: "http://localhost:26657",
    rest: "http://localhost:1317",
    chainId: "testing",
    chainName: "Wasmd Localhost",
    stakeCurrency: {
      coinDenom: "STAKE",
      coinMinimalDenom: "ustake",
      coinDecimals: 6,
      coinGeckoId: "stars",
      coinImageUrl: "https://stargaze.zone/logo.png",
    },
    bip44: {
      coinType: 118,
    },
    bech32Config: Bech32Address.defaultBech32Config("wasm"),
    currencies: [
      {
        coinDenom: "STAKE",
        coinMinimalDenom: "ustake",
        coinDecimals: 6,
        coinGeckoId: "stars",
        coinImageUrl: "https://stargaze.zone/logo.png",
      },
    ],
    feeCurrencies: [
      {
        coinDenom: "STAKE",
        coinMinimalDenom: "ustake",
        coinDecimals: 6,
        coinGeckoId: "stargaze",
        coinImageUrl: "https://stargaze.zone/logo.png",
      },
    ],
    coinType: 118,
    features: ["stargate", "ibc-transfer"],
    explorerUrlToTx: "https://www.mintscan.io/stargaze/txs/{txHash}",
  },
  {
    rpc: "https://rpc.stargaze-apis.com/",
    rest: "https://rest.stargaze-apis.com/",
    chainId: "stargaze-1",
    chainName: "Stargaze",
    stakeCurrency: {
      coinDenom: "STARS",
      coinMinimalDenom: "ustars",
      coinDecimals: 6,
      coinGeckoId: "stars",
      coinImageUrl: "https://stargaze.zone/logo.png",
    },
    bip44: {
      coinType: 118,
    },
    bech32Config: Bech32Address.defaultBech32Config("stars"),
    currencies: [
      {
        coinDenom: "STARS",
        coinMinimalDenom: "ustars",
        coinDecimals: 6,
        coinGeckoId: "stars",
        coinImageUrl: "https://stargaze.zone/logo.png",
      },
    ],
    feeCurrencies: [
      {
        coinDenom: "STARS",
        coinMinimalDenom: "ustars",
        coinDecimals: 6,
        coinGeckoId: "stargaze",
        coinImageUrl: "https://stargaze.zone/logo.png",
      },
    ],
    coinType: 118,
    features: ["stargate", "ibc-transfer", "no-legacy-stdTx"],
    explorerUrlToTx: "https://www.mintscan.io/stargaze/txs/{txHash}",
  },
  {
    rpc: "https://rpc.devnet.publicawesome.dev/",
    rest: "https://rest.devnet.publicawesome.dev/",
    chainId: "stargaze-devnet-1",
    chainName: "Stargaze Devnet",
    stakeCurrency: {
      coinDenom: "STARS",
      coinMinimalDenom: "ustars",
      coinDecimals: 6,
      coinGeckoId: "stars",
      coinImageUrl: "https://stargaze.zone/logo.png",
    },
    bip44: {
      coinType: 118,
    },
    bech32Config: Bech32Address.defaultBech32Config("stars"),
    currencies: [
      {
        coinDenom: "STARS",
        coinMinimalDenom: "ustars",
        coinDecimals: 6,
        coinGeckoId: "stars",
        coinImageUrl: "https://stargaze.zone/logo.png",
      },
    ],
    feeCurrencies: [
      {
        coinDenom: "STARS",
        coinMinimalDenom: "ustars",
        coinDecimals: 6,
        coinGeckoId: "stargaze",
        coinImageUrl: "https://stargaze.zone/logo.png",
      },
    ],
    coinType: 118,
    features: ["stargate", "ibc-transfer", "no-legacy-stdTx"],
    explorerUrlToTx: "https://www.mintscan.io/stargaze/txs/{txHash}",
  },
  {
    rpc: "https://rpc.elgafar-1.stargaze-apis.com/",
    rest: "https://rest.elgafar-1.stargaze-apis.com/",
    chainId: "elgafar-1",
    chainName: "Stargaze Testnet",
    stakeCurrency: {
      coinDenom: "STARS",
      coinMinimalDenom: "ustars",
      coinDecimals: 6,
      coinGeckoId: "stars",
      coinImageUrl: "https://stargaze.zone/logo.png",
    },
    bip44: {
      coinType: 118,
    },
    bech32Config: Bech32Address.defaultBech32Config("stars"),
    currencies: [
      {
        coinDenom: "STARS",
        coinMinimalDenom: "ustars",
        coinDecimals: 6,
        coinGeckoId: "stars",
        coinImageUrl: "https://stargaze.zone/logo.png",
      },
    ],
    feeCurrencies: [
      {
        coinDenom: "STARS",
        coinMinimalDenom: "ustars",
        coinDecimals: 6,
        coinGeckoId: "stargaze",
        coinImageUrl: "https://stargaze.zone/logo.png",
      },
    ],
    coinType: 118,
    features: ["stargate", "ibc-transfer", "no-legacy-stdTx"],
    explorerUrlToTx: "https://www.mintscan.io/stargaze/txs/{txHash}",
  },
  {
    rpc: "https://rpc-osmosis.keplr.app",
    rest: "https://lcd-osmosis.keplr.app",
    chainId: "osmosis-1",
    chainName: "Osmosis",
    stakeCurrency: {
      coinDenom: "OSMO",
      coinMinimalDenom: "uosmo",
      coinDecimals: 6,
      coinGeckoId: "osmosis",
      coinImageUrl: "https://app.osmosis.zone/public/assets/tokens/osmosis.svg",
    },
    bip44: {
      coinType: 118,
    },
    bech32Config: Bech32Address.defaultBech32Config("osmo"),
    currencies: [
      {
        coinDenom: "OSMO",
        coinMinimalDenom: "uosmo",
        coinDecimals: 6,
        coinGeckoId: "osmosis",
        coinImageUrl:
          "https://app.osmosis.zone/public/assets/tokens/osmosis.svg",
      },
      {
        coinDenom: "ION",
        coinMinimalDenom: "uion",
        coinDecimals: 6,
        coinGeckoId: "ion",
        coinImageUrl: "https://app.osmosis.zone/public/assets/tokens/ion.png",
      },
    ],
    feeCurrencies: [
      {
        coinDenom: "OSMO",
        coinMinimalDenom: "uosmo",
        coinDecimals: 6,
        coinGeckoId: "osmosis",
        coinImageUrl:
          "https://app.osmosis.zone/public/assets/tokens/osmosis.svg",
      },
    ],
    features: ["stargate", "ibc-transfer"],
    explorerUrlToTx: "https://www.mintscan.io/osmosis/txs/{txHash}",
  },
  {
    rpc: "https://rpc-cosmoshub.keplr.app",
    rest: "https://lcd-cosmoshub.keplr.app",
    chainId: "cosmoshub-4",
    chainName: "Cosmos Hub",
    stakeCurrency: {
      coinDenom: "ATOM",
      coinMinimalDenom: "uatom",
      coinDecimals: 6,
      coinGeckoId: "cosmos",
      coinImageUrl: "https://app.osmosis.zone/public/assets/tokens/cosmos.svg",
    },
    bip44: {
      coinType: 118,
    },
    bech32Config: Bech32Address.defaultBech32Config("cosmos"),
    currencies: [
      {
        coinDenom: "ATOM",
        coinMinimalDenom: "uatom",
        coinDecimals: 6,
        coinGeckoId: "cosmos",
        coinImageUrl:
          "https://app.osmosis.zone/public/assets/tokens/cosmos.svg",
      },
    ],
    feeCurrencies: [
      {
        coinDenom: "ATOM",
        coinMinimalDenom: "uatom",
        coinDecimals: 6,
        coinGeckoId: "cosmos",
        coinImageUrl:
          "https://app.osmosis.zone/public/assets/tokens/cosmos.svg",
      },
    ],
    coinType: 118,
    features: ["stargate", "ibc-transfer"],
    explorerUrlToTx: "https://www.mintscan.io/cosmos/txs/{txHash}",
  },
];
