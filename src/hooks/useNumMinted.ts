import { trpcNextPW } from "src/server/utils/trpc";

export const useNumMinted = (
  slug: string | null | undefined,
  refreshInterval: number | undefined = 10000
) => {
  // const { data, error } = useSWR(
  //   sg721
  //     ? `${config.restEndpoint}/cosmwasm/wasm/v1/contract/${sg721}/smart/eyJudW1fdG9rZW5zIjp7fX0=`
  //     : null,
  //   { refreshInterval, fallback: { data: { count: 0 } } }
  // );

  const numMinted = trpcNextPW.works.workTokenCount.useQuery(
    { slug: slug || "" },
    { enabled: !!slug }
  );

  return numMinted;
};
