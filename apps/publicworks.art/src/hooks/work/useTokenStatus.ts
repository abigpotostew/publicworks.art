import { trpcNextPW } from "../../server/utils/trpc";

export const useTokenStatus = ({
  workId,
  take,
  cursor,
}: {
  workId: number | null | undefined;
  take: number;
  cursor: string | null | undefined;
}) => {
  return trpcNextPW.works.tokenStatus.useInfiniteQuery(
    { workId: workId as number, take },
    {
      getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) =>
        lastPage.nextCursor,
      // getPreviousPageParam: (
      //   firstPage,
      //   allPages,
      //   firstPageParam,
      //   allPageParams
      // ) => firstPage.nextCursor,
      initialCursor: cursor, // <-- optional you can pass an initialCursor
      refetchInterval: 10000,
      enabled: !!workId,
    }
  );
};
