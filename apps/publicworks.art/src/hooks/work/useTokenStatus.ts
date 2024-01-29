import { trpcNextPW } from "../../server/utils/trpc";

export const useTokenStatus = ({
  workId,
  take,
  skip,
}: {
  workId: number | null | undefined;
  take: number;
  skip: number;
}) => {
  return trpcNextPW.works.tokenStatus.useQuery(
    { workId: workId as number, take, skip },
    {
      refetchInterval: 10000,
      enabled: !!workId,
    }
  );
};
