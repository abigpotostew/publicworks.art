import type { CosmWasmClient } from "@cosmjs/cosmwasm-stargate/build/cosmwasmclient";
import { MarketplaceQueryClient } from "@stargazezone/contracts/marketplace";
import type { CollectionInfoResponse } from "@stargazezone/types/contracts/sg721";
import getFloorPrice from "@stargazezone/client/core/collections/getFloorPrice";
import {
  Collection,
  GetCollectionOptions,
  NumTokensResponse,
  SG721InfoResponse,
} from "./types";
import { normalizeIpfsUri } from "src/wasm/metadata";

async function _getCollectionInfo(
  contract: string,
  client?: CosmWasmClient
): Promise<CollectionInfoResponse> {
  if (!client) {
    throw new Error("No CosmWasm client provided.");
  }

  try {
    const collectionInfo = await client.queryContractSmart(contract, {
      collection_info: {},
    });
    collectionInfo.image = normalizeIpfsUri(collectionInfo.image);
    return collectionInfo;
  } catch (e) {
    console.log(e);

    throw new Error(`Error fetching collection info for: ${contract}`);
  }
}

async function _getContractInfo(
  contract: string,
  client?: CosmWasmClient
): Promise<SG721InfoResponse> {
  if (!client) {
    throw new Error("No CosmWasm client provided.");
  }
  const sg721Info = await client.queryContractSmart(contract, {
    contract_info: {},
  });

  return sg721Info;
}

async function _getNumTokens(
  contract: string,
  client?: CosmWasmClient
): Promise<NumTokensResponse> {
  if (!client) {
    throw new Error("No CosmWasm client provided.");
  }
  const sg721Info = await client.queryContractSmart(contract, {
    num_tokens: {},
  });

  return sg721Info;
}

async function _getMarketplaceInfo(
  address: string,
  marketContract: string,
  client?: CosmWasmClient
) {
  if (!client) {
    throw new Error("No CosmWasm client provided.");
  }
  if (!marketContract) {
    return;
  }

  try {
    return await client.queryContractSmart(marketContract, {
      ask_count: { collection: address },
    });
  } catch (e) {
    console.log(e);

    throw new Error(
      `Error fetching marketplace info for: ${address}, marketContract: ${marketContract}`
    );
  }
}

type Args = {
  address: string;
  client: CosmWasmClient;
  marketContract?: string;
  marketplaceClient: MarketplaceQueryClient | null;
};

export default async function getCollection(
  { address, client, marketContract, marketplaceClient }: Args,
  options?: GetCollectionOptions
): Promise<Collection> {
  if (!client) {
    throw new Error("No CosmWasm client provided.");
  }

  let marketplaceInfo = null;
  const collectionInfo = await _getCollectionInfo(address, client);
  const sg721Info = await _getContractInfo(address, client);
  const numTokens = await _getNumTokens(address, client);

  if (options?.includeMarketplaceInfo && marketContract) {
    marketplaceInfo = await _getMarketplaceInfo(
      address,
      marketContract,
      client
    );

    // get floor price
    if (marketplaceClient) {
      const floorPrice = await getFloorPrice(marketplaceClient, address);
      marketplaceInfo.floorPrice = floorPrice;
    }
  }

  return {
    contractAddress: address,
    ...collectionInfo,
    ...sg721Info,
    numTokens: numTokens.count,
    marketplaceInfo,
  };
}
