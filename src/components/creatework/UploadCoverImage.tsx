import { FC, useEffect } from "react";
import { EditProjectRequest } from "../../store";
import { WorkSerializable } from "../../dbtypes/works/workSerializable";
import { FlexBoxCenter } from "../layout/FlexBoxCenter";
import { DropZone } from "../DropZone";
import { getDataUrl } from "../../base64/file";
import { trpcNextPW } from "../../server/utils/trpc";
import SpinnerLoading from "../loading/Loader";
import { normalizeIpfsUri } from "../../wasm/metadata";
import { Container } from "react-bootstrap";

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
  const mutation = trpcNextPW.works.uploadPreviewImg.useMutation({
    onSuccess() {
      utils.works.getWorkById.invalidate();
    },
  });

  const onUpload = async (files: File[]) => {
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
    const fileEncoded = await getDataUrl(files[0]);
    const id = props?.defaultValues?.id;
    if (!id) {
      throw new Error("missing id");
    }
    mutation.mutate({
      workId: id,
      coverImageDataUrl: fileEncoded,
    });
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
          <DropZone onUpload={onUpload}></DropZone>
          {mutation.isLoading && <SpinnerLoading></SpinnerLoading>}
          {mutation.isSuccess && "Success!"}
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
