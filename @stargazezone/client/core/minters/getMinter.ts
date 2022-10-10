import type { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import getCollection from '../collections/getCollection';
import getNumTokensLeft from './getNumTokensLeft';
import { getWhitelistInfo } from './getWhitelistInfo';
import type { GetMintersOptions, Minter } from './types';

export default async function getMinter(
  contract: string,
  client: CosmWasmClient,
  options: GetMintersOptions
): Promise<Minter> {
  // Query Minter contract info
  let config = await client.queryContractSmart(contract, {
    config: {},
  });

  // Query white list contract if configured
  let whitelistInfo = null;
  if (config.whitelist && options.includeWhitelist) {
    whitelistInfo = await getWhitelistInfo(config.whitelist, client);
  }

  // Query Collection info
  const collection = await getCollection({
    address: config.sg721_address,
    client,
    marketplaceClient: null,
  });

  let minter: Minter = {
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

  return minter;
}
