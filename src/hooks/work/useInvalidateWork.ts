import { trpcNextPW } from "../../server/utils/trpc";
import { useCallback } from "react";

export const useInvalidateWork = () => {
  const utils = trpcNextPW.useContext();
  const invalidateWork = useCallback(
    ({ id, slug }: { id?: string; slug?: string }) => {
      id && utils.works.getWorkById.invalidate({ id });
      slug && utils.works.getWorkBySlug.invalidate({ slug });
    },
    []
  );

  return { invalidateWork };
};
