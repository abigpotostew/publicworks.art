import { AppRouterUtilContext } from "../server/utils/trpc";

export const onWorkUpload = async (
  workId: string,
  files: File[],
  utils: AppRouterUtilContext
) => {
  if (files.length !== 1) {
    throw new Error("required single file");
  }
  const formData = new FormData();
  formData.append("file", files[0]);
  const response = await fetch(`/api/${workId}/workUpload`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    throw new Error("Upload failed: " + (await response.json())?.message);
  }
  const newCodeUrl = (await response.json()).url;
  // setCodeUrl(newCodeUrl);
  console.log("workUpload status", newCodeUrl);
  utils.works.getWorkById.invalidate();
  return true;
};
