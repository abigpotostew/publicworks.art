import useSWR from "swr";
import config from "../wasm/config";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useNumMinted = (
  sg721: string | null | undefined,
  refreshInterval: number | undefined = 10000
) => {
  const { data, error } = useSWR(
    sg721
      ? `${config.restEndpoint}/cosmwasm/wasm/v1/contract/${sg721}/smart/eyJudW1fdG9rZW5zIjp7fX0=`
      : null,
    { refreshInterval, fallback: { data: { count: 0 } } }
  );

  return {
    numMinted: (data?.data?.count as number | null) || 0,
    loading: !data,
    error,
  };
};
