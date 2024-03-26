import { useQuery } from "@tanstack/react-query";
import config from "../wasm/config";
import { useCollectionSize } from "./useCollectionSize";

export const useNumMintedOnChain = (
  minter: string | undefined | null,
  refreshInterval?: number
) => {
  const collectionSize = useCollectionSize(minter);

  const mintableNumberTokens = useQuery({
    queryKey: [
      `${config.restEndpoint}/cosmwasm/wasm/v1/contract/${minter}/smart/eyJtaW50YWJsZV9udW1fdG9rZW5zIjp7fX0K`,
    ],
    queryFn: async () => {
      if (!minter) {
        return 0;
      }
      const res = await fetch(
        `${config.restEndpoint}/cosmwasm/wasm/v1/contract/${minter}/smart/eyJtaW50YWJsZV9udW1fdG9rZW5zIjp7fX0K`
      );
      if (!res.ok) {
        throw new Error(
          "failed to get num minted on chain" +
            res.status +
            ", " +
            (await res.text().toString())
        );
      }
      const json = await res.json();
      return (json?.data?.count as number | null) || 0;
    },
    refetchInterval: refreshInterval,
    enabled: !!minter,
  });

  return useQuery({
    queryKey: [
      "useNumMintedOnChain",
      mintableNumberTokens.data,
      collectionSize.data,
    ],
    queryFn: async () => {
      if (typeof mintableNumberTokens.data !== "number") {
        return 0;
      }
      if (typeof collectionSize.data !== "number") {
        return 0;
      }
      return collectionSize.data - mintableNumberTokens.data;
    },
    enabled:
      typeof mintableNumberTokens.data === "number" &&
      typeof collectionSize.data === "number",
  });
};
