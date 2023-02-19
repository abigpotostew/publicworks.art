import config from "../wasm/config";
import { useQuery } from "@tanstack/react-query";

export const useCollectionSize = (
  minter: string | undefined | null,
  refreshInterval?: number
) => {
  const query = useQuery(
    [
      `${config.restEndpoint}/cosmwasm/wasm/v1/contract/${minter}/smart/eyJjb25maWciOnt9fQ==`,
    ],
    async () => {
      if (!minter) {
        return 0;
      }
      const res = await fetch(
        `${config.restEndpoint}/cosmwasm/wasm/v1/contract/${minter}/smart/eyJjb25maWciOnt9fQ==`
      );
      if (!res.ok) {
        throw new Error(
          "failed to get collection size" +
            res.status +
            ", " +
            (await res.text().toString())
        );
      }
      const json = await res.json();
      return (json?.data?.num_tokens as number | null) || 0;
    },
    { refetchInterval: refreshInterval, enabled: !!minter }
  );

  return {
    collectionSize: query.data,
    loading: query.isLoading,
    error: query.error,
  };
};
