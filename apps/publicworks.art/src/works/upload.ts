import { AppRouterUtilContext, trpcNextPW } from "../server/utils/trpc";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "src/hooks/useToast";

export const onWorkUploadNew = async (
  workId: number,
  files: File[],
  utils: AppRouterUtilContext,
  uploadPresignedUrl: string,
  method: string
) => {
  if (files.length !== 1) {
    throw new Error("required single file");
  }

  const response = await fetch(uploadPresignedUrl, {
    method,
    body: files[0],
    headers: {
      "Content-Type": files[0].type,
    },
  });
  if (!response.ok) {
    throw new Error("Upload failed: " + (await response.json())?.message);
  }
  //now confirm it
  return true;
};

export const useUploadWorkMutation = (workId: number | null | undefined) => {
  const utils = trpcNextPW.useContext();
  const toast = useToast();
  const onWorkUploadFileMutation =
    trpcNextPW.works.uploadWorkGenerateUrl.useMutation();
  const confirmWorkUploadFileMutation =
    trpcNextPW.works.confirmWorkUpload.useMutation();
  const onUploadMutation = useMutation(async (files: File[]) => {
    if (!workId) {
      const msg = "work id not defined";
      toast.error(msg);
      throw new Error(msg);
    }
    const contentSize = files[0].size;
    const uploadTmp = await onWorkUploadFileMutation.mutateAsync({
      workId: workId,
      contentSize,
    });

    if (!uploadTmp.ok) {
      const msg =
        "Something went wrong while uploading the code work, try again.";
      toast.error(msg);
      throw new Error(msg);
    }
    await onWorkUploadNew(
      workId,
      files,
      utils,
      uploadTmp.url,
      uploadTmp.method
    );
    try {
      await confirmWorkUploadFileMutation.mutateAsync({
        workId,
        uploadId: uploadTmp.uploadId,
      });
    } catch (e) {
      const msg =
        "Something went wrong. Failed to save work to IPFS. Try again.";
      console.error(msg, e);
      toast.error(msg);
      throw new Error(msg);
    }
    utils.works.getWorkById.invalidate({ id: workId });
  });
  return onUploadMutation;
};