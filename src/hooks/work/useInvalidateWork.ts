import { trpcNextPW } from "../../server/utils/trpc";

export const useInvalidateWork = () => {
  const utils = trpcNextPW.useContext();
  return ({ id, slug }: { id?: string; slug?: string }) => {
    id && utils.works.getWorkById.invalidate({ id });
    slug && utils.works.getWorkBySlug.invalidate({ slug });
  };
};
