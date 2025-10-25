import { trpcNextPW } from "../../server/utils/trpc";
import { useCallback } from "react";

export const useInvalidateWork = () => {
  const utils = trpcNextPW.useContext();
  const invalidateWork = useCallback(
    ({ id, slug }: { id?: number; slug?: string }) => {
      id && utils.works.getWorkById.invalidate({ id });
      slug && utils.works.getWorkBySlug.invalidate({ slug });
    },
    [utils]
  );

  return { invalidateWork };
};
