import { trpcNextPW } from "../server/utils/trpc";
import { onMutateLogin } from "../trpc/onMutate";
import { useToast } from "./useToast";
import { useStargazeClient } from "../../@stargazezone/client";

export const useEditWorkMutation = () => {
  const toast = useToast();
  const utils = trpcNextPW.useContext();
  const sgclient = useStargazeClient();
  return trpcNextPW.works.editWork.useMutation({
    onMutate: onMutateLogin(sgclient.client, toast),
    onSuccess() {
      toast.success("Saved!");
      utils.works.getWorkById.invalidate();
    },
  });
};
