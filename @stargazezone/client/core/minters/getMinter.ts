import type { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import getCollection from "../collections/getCollection";
import getNumTokensLeft from "./getNumTokensLeft";
import { getWhitelistInfo } from "./getWhitelistInfo";
import type { GetMintersOptions, Minter } from "./types";

export default async function getMinter(
  contract: string,
  client: CosmWasmClient,
  options: GetMintersOptions
): Promise<Minter> {
  // Query Minter contract info
  const config = await client.queryContractSmart(contract, {
    config: {},
  });

  // console.log("pizza minterResponse, got config");
  // Query white list contract if configured
  let whitelistInfo = null;
  if (config.whitelist && options.includeWhitelist) {
    whitelistInfo = await getWhitelistInfo(config.whitelist, client);
  }
  // console.log("pizza minterResponse, got whitelistInfo");

  // Query Collection info
  const collection = await getCollection(
    {
      address: config.sg721_address,
      client,
      marketplaceClient: null,
    },
    { includeMarketplaceInfo: false, includeNameAndSymbol: false }
  );
  // console.log("pizza minterResponse, got collection");

  const minter: Minter = {
    contractAddress: contract,
    collection,
    config,
    whitelistInfo,
  };

  // percent minted:
  if (options.includePercentMinted) {
    const tokensLeft = await getNumTokensLeft(contract, client);
    const totalTokens = config.num_tokens;
    let percentMinted = ((totalTokens - tokensLeft) / totalTokens) * 100;
    percentMinted = Math.floor(percentMinted);
    minter.percentMinted = percentMinted;
  }

  // console.log("pizza minterResponse complete");
  return minter;
}
