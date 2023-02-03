import type { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { Collection } from "@stargazezone/client";
import { MarketplaceQueryClient } from "@stargazezone/contracts/marketplace";
import { Sg721QueryClient } from "@stargazezone/contracts/sg721";
import { Attribute } from "src/hooks/useNftMetadata";
import {
  fetchTokenUriInfo,
  normalizeIpfsAnimationUri,
  normalizeIpfsUri,
} from "src/wasm/metadata";

export interface MediaType {
  tokenId: string;
  creator: string;
  owner: string;
  tokenUri: string;
  name: string;
  description: string;
  image: string;
  collection: Collection;
  price: string | null;
  attributes?: Attribute[];
  animation_url: string | null;
  traits?: any;
  reserveFor?: string | null;
  expiresAt?: string | null;
  expiresAtDateTime?: string | null;
}
export default async function getNFT({
  client,
  collection,
  tokenId,
  sg721,
  marketContract,
}: {
  client: CosmWasmClient;
  collection: Collection;
  tokenId: number | string;
  sg721: Sg721QueryClient;
  marketContract: string;
}): Promise<MediaType> {
  // make sure tokenId is a string
  const tokenIdString = tokenId.toString();

  let nft, nftInfo;

  try {
    nft = await sg721.allNftInfo({ tokenId: tokenIdString });
  } catch (e) {
    throw new Error("Error fetching nft");
  }

  // Catch errors if token URI is broken
  try {
    nftInfo = await fetchTokenUriInfo(
      normalizeIpfsUri(nft.info.token_uri as string)
    );
  } catch (e) {
    try {
      nftInfo = await fetchTokenUriInfo(
        normalizeIpfsUri(`${nft.info.token_uri}.json`)
      );
    } catch (e) {
      throw new Error("Error fetching nft uri info");
    }
  }

  const animation_url =
    (nftInfo.animation_url &&
      normalizeIpfsAnimationUri(nftInfo.animation_url)) ||
    null;

  const mediaItem: MediaType = {
    ...nftInfo,
    name: nftInfo.name || "missing",
    creator: collection.creator,
    collection,
    tokenId: tokenId?.toString() || "missing",
    owner: nft.access.owner,
    tokenUri: nft.info.token_uri || "missing",
    animation_url,
    price: "<missing>",
  };

  try {
    if (marketContract) {
      const market = new MarketplaceQueryClient(client, marketContract);
      const { ask } = await market.ask({
        collection: sg721.contractAddress,
        tokenId: Number(tokenId),
      });
      mediaItem.price = ask ? ask.price : null;
    }
  } catch (e) {
    console.log("Error fetching market price.");
  }

  return mediaItem;
}
