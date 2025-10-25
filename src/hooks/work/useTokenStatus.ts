import { trpcNextPW } from "../../server/utils/trpc";

export const useTokenStatus = ({
  workId,
  take,
  cursor,
}: {
  workId: number | null | undefined;
  take: number;
  cursor: number | null | undefined;
}) => {
  return trpcNextPW.works.tokenStatus.useQuery(
    { workId: workId as number, take, cursor: cursor?.toString() },
    {
      refetchInterval: 10000,
      enabled: !!workId,
    }
  );
};
