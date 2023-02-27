import { trpcNextPW } from "src/server/utils/trpc";

export const useNumMinted = (
  slug: string | null | undefined,
  refreshInterval: number | undefined = 10000
) => {
  const numMinted = trpcNextPW.works.workTokenCount.useQuery(
    { slug: slug || "" },
    { enabled: !!slug, refetchInterval: refreshInterval }
  );

  return numMinted;
};
