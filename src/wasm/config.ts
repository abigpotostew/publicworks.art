const configBase = {
  // Testnet values
  testnet: {
    rpcEndpoint: "https://rpc.elgafar-1.stargaze-apis.com/",
    restEndpoint: "https://rest.elgafar-1.stargaze-apis.com",
    chainId: "elgafar-1",
    testnet:true,
  },
  // Production Values
  production: {
    rpcEndpoint: "https://rpc.stargaze-apis.com/",
    restEndpoint: "https://rest.stargaze-apis.com",
    chainId: "stargaze-1",
    testnet:false,
  },
  useTestnet: true, // Set to false on mainnet
};

export type Config = typeof configBase.testnet & typeof configBase.production ;

const config = {
   ...(configBase.useTestnet
    ? configBase.testnet
    : configBase.production)
} as Config;
config.testnet = configBase.useTestnet;
Object.freeze(config);

export default config;
