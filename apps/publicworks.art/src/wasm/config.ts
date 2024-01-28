const configBase = {
  // Testnet values
  testnet: {
    rpcEndpoint: "https://rpc.elgafar-1.stargaze-apis.com/",
    restEndpoint: "https://rest.elgafar-1.stargaze-apis.com",
    chainId: "elgafar-1",
    testnet: true,
    sg721CodeId: 3291,
    sg721V1CodeId: 133,
    //v8 is removing fairburn and increase pw fee to 4%
    //v9 is increase airdrop fee and remove all stargaze fees
    minterCodeId: 3290, //v8 3285, //v7 2233, //v6 //1844,//v5 //v4 //1842 //<-v3 //1838 //<- v2
    minterV1CodeId: 134,
    whitelistCodeId: 3,
    finalizerCodeId: 132,
    finalizer:
      "stars107h5lh00zzdp8yqpdc3x8vtnaufh4ts5uay8x4vjyws9xzhrm3ysaw34as",
    launchpadUrl: "https://testnet.publicawesome.dev",
  },
  // Production Values
  production: {
    rpcEndpoint: "https://rpc.stargaze-apis.com/",
    restEndpoint: "https://rest.stargaze-apis.com",
    chainId: "stargaze-1",
    testnet: false,
    sg721CodeId: 9,
    minterCodeId: 10,
    minterV1CodeId: 10,
    whitelistCodeId: 3,
    finalizerCodeId: 11,
    finalizer:
      "stars1urdxzux805z7xltx0vzdaqhlmm3helvklprz03svwykmlhmaayyq7pwl8t",
    launchpadUrl: "https://www.stargaze.zone",
  },
  useTestnet: process.env.NEXT_PUBLIC_TESTNET === "true", // Set to false on mainnet
};

export type Config = typeof configBase.testnet & typeof configBase.production;

const config = {
  ...(configBase.useTestnet ? configBase.testnet : configBase.production),
} as Config;
config.testnet = configBase.useTestnet;
Object.freeze(config);

export default config;
