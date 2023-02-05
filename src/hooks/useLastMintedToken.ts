import { trpcNextPW } from "src/server/utils/trpc";

export const useLastMintedToken = (
  slug: string | null | undefined,
  refreshInterval: number | undefined = 10000
) => {
  const token = trpcNextPW.works.lastMintedToken.useQuery(
    { slug: slug || "" },
    { enabled: !!slug, refetchInterval: refreshInterval }
  );

  return token;
};
