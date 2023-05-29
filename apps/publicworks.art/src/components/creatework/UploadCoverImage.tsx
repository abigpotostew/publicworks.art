import { FC } from "react";
import { EditProjectRequest } from "../../store";
import { WorkSerializable } from "../../../../../packages/db-typeorm/src/serializable/works/workSerializable";
import { FlexBoxCenter } from "../layout/FlexBoxCenter";
import { DropZone } from "../DropZone";
import { trpcNextPW } from "../../server/utils/trpc";
import SpinnerLoading from "../loading/Loader";
import { normalizeIpfsUri } from "../../wasm/metadata";
import { Container } from "react-bootstrap";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "../../hooks/useToast";
import { onWorkUploadNew } from "../../works/upload";

export interface CreateWorkProps {
  onCreateProject:
    | ((req: Partial<EditProjectRequest>) => void)
    | ((req: Partial<EditProjectRequest>) => Promise<void>);
  defaultValues?: WorkSerializable;
  onUpload?: (files: File[]) => Promise<void>;
}

export const UploadCoverImage: FC<CreateWorkProps> = (
  props: CreateWorkProps
) => {
  // auth context here
  const defaults = {
    coverImageCid: props.defaultValues?.coverImageCid,
  };

  const utils = trpcNextPW.useContext();

  const presignedUrlMutation =
    trpcNextPW.works.uploadWorkCoverImageGenerateUrl.useMutation();

  const confirmWorkUploadFileMutation =
    trpcNextPW.works.confirmWorkCoverImageUpload.useMutation();
  const toast = useToast();
  const onUploadMutation = useMutation(async (files: File[]) => {
    //onUpload
    const mime = files[0].type;
    const acceptedMime = [
      "image/png",
      "image/gif",
      "image/jpeg",
      "image/svg+xml",
    ];
    if (!acceptedMime.includes(mime)) {
      throw new Error("Unsupported mime: " + mime);
    }
    const contentSize = files[0].size;
    const id = props?.defaultValues?.id;
    if (!id) {
      throw new Error("missing id");
    }
    console.log("presignedUrlMutation", {
      workId: id,
      contentType: mime,
      contentSize,
    });
    const uploadTmp = await presignedUrlMutation.mutateAsync({
      workId: id,
      contentType: mime,
      contentSize,
    });
    if (!uploadTmp.ok) {
      const msg =
        "Something went wrong while uploading the cover image, try again.";
      toast.error(msg);
      throw new Error(msg);
    }
    console.log("uploading", id, files, utils, uploadTmp.url, uploadTmp.method);
    await onWorkUploadNew(id, files, utils, uploadTmp.url, uploadTmp.method);
    try {
      // console.log("pizza finished confirmWorkUploadFileMutation");
      await confirmWorkUploadFileMutation.mutateAsync({
        workId: id,
        uploadId: uploadTmp.uploadId,
      });
    } catch (e) {
      const msg =
        "Something went wrong. Failed to save cover image to IPFS. Try again.";
      console.error(msg, e);
      toast.error(msg);
      throw new Error(msg);
    } finally {
      utils.works.getWorkById.invalidate({ id });
    }
  });

  const onUpload = async (files: File[]) => {
    await onUploadMutation.mutateAsync(files);
  };
  // useEffect(() => {
  //   return () => {
  //     console.log("unmount upload cover image");
  //     mutation.reset();
  //   };
  // });

  return (
    <Container>
      <h2>Collection Image</h2>
      <FlexBoxCenter fluid={false}>
        <div>
          <DropZone
            accept={"images"}
            onUpload={onUpload}
            maxFiles={1}
            maxSize={15_000_000}
          >
            Drag 'n' drop your image here, or click to select a file. 15mb max.
          </DropZone>
          {onUploadMutation.isLoading && <SpinnerLoading></SpinnerLoading>}
          {onUploadMutation.isSuccess && "Success!"}
        </div>
        {defaults.coverImageCid && (
          <div>
            <div>Your cover image:</div>
            <img
              style={{ maxWidth: 500 }}
              src={normalizeIpfsUri("ipfs://" + defaults.coverImageCid)}
            />
          </div>
        )}
        {!defaults.coverImageCid && <div>No cover image yet, upload one</div>}
      </FlexBoxCenter>
    </Container>
  );
};
