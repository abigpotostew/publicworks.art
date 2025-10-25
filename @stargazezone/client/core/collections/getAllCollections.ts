import type { CosmWasmClient } from "@cosmjs/cosmwasm-stargate/build/cosmwasmclient";
import { MarketplaceQueryClient } from "@stargazezone/contracts/marketplace";
import getCollection from "./getCollection";
import { GetCollectionOptions } from "./types";

type Args = {
  codeId: number;
  client: CosmWasmClient;
  marketContract?: string;
  marketplaceClient: MarketplaceQueryClient | null;
};

export default async function getAllCollections(
  { codeId, client, marketContract, marketplaceClient }: Args,
  options: GetCollectionOptions = {
    includeMarketplaceInfo: false,
  },
  exclude: string[] = []
) {
  if (!client) {
    throw new Error("No CosmWasm client provided.");
  }

  const collections = await client.getContracts(codeId);
  const filteredCollections = collections.filter((c) => !exclude.includes(c));

  return Promise.all(
    filteredCollections.map(
      async (address) =>
        await getCollection(
          { address, client, marketContract, marketplaceClient },
          options
        )
    )
  );
}
