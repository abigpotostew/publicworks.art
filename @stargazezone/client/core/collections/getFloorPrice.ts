import { MarketplaceQueryClient } from '@stargazezone/contracts/marketplace';

export default async function getFloorPrice(
  marketplace: MarketplaceQueryClient,
  collectionAddress: string
): Promise<string> {
  const { asks } = await marketplace.asksSortedByPrice({
    collection: collectionAddress,
    limit: 1,
  });

  return asks[0]?.price ?? '0';
}
