import useSWR from "swr";
import config from "../wasm/config";

export const useNumMinted = (
  sg721: string,
  refreshInterval: number | undefined = 10000
) => {
  const { data, error } = useSWR(
    `${config.restEndpoint}/cosmwasm/wasm/v1/contract/${sg721}/smart/eyJudW1fdG9rZW5zIjp7fX0=`,
    { refreshInterval, fallback: { data: { count: 0 } } }
  );

  return {
    numMinted: (data?.data?.count as number | null) || 0,
    loading: !data,
    error,
  };
};
