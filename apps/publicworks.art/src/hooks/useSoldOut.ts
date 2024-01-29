import { useNumMinted } from "./useNumMinted";
import { useCollectionSize } from "./useCollectionSize";
import { WorkSerializable } from "@publicworks/db-typeorm/serializable";
import { useQuery } from "@tanstack/react-query";

export const useSoldOut = (work: WorkSerializable | null | undefined) => {
  const numMintedQuery = useNumMinted(work?.slug);
  const collectionSizeQuery = useCollectionSize(work?.minter);
  return useQuery(
    [
      "soldOut",
      work?.slug,
      numMintedQuery.data,
      numMintedQuery.dataUpdatedAt,
      collectionSizeQuery.dataUpdatedAt,
      collectionSizeQuery.data,
    ],
    async () => {
      if (!numMintedQuery.data || !collectionSizeQuery.data) {
        return false;
      }
      return numMintedQuery.data >= collectionSizeQuery.data;
    }
  );
};
