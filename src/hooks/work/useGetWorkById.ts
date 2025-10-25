import { trpcNextPW } from "../../server/utils/trpc";
export const useGetWorkById = (workId: number | string | null | undefined) => {
  const workIdNumeric = workId ? parseInt(workId.toString() as string) : null;
  return trpcNextPW.works.getWorkById.useQuery(
    {
      id: workIdNumeric as number,
    },
    {
      enabled:
        !!workIdNumeric &&
        typeof workIdNumeric === "number" &&
        Number.isFinite(workIdNumeric),
    }
  );
};
