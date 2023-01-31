import { WorkEntity } from "src/model";
import { getBucket } from "src/upload/presignedUrl";
import { stores } from "src/store/stores";
import tmp from "tmp";
import {
  deleteCid,
  getMetadataWorkId,
  pinZipToPinata,
  uploadFileToPinata,
} from "src/ipfs/pinata";
import { TRPCError } from "@trpc/server";
import * as fs from "fs";

function getFilesizeInBytes(filename: string) {
  const stats = fs.statSync(filename);
  const fileSizeInBytes = stats.size;
  return fileSizeInBytes;
}
export const confirmUpload = async (uploadId: string, work: WorkEntity) => {
  //download the file, it should be a zip
  const upload = await stores().project.getFileUploadById(uploadId, work);
  if (!upload) {
    throw new TRPCError({
      message: "Work code was not uploaded",
      code: "NOT_FOUND",
    });
  }
  //create tmp file
  const tmpobj = tmp.fileSync();
  const tmpPath = tmpobj.name;
  console.log("Tmp File Created for confirm: ", tmpPath);

  //download it, check file size within limits
  await getBucket()
    .file(upload.filename)
    .download({ destination: tmpobj.name });

  if (getFilesizeInBytes(tmpobj.name) > 50_000_000) {
    throw new TRPCError({
      message: "Work code size limit is 50mb.",
      code: "BAD_REQUEST",
    });
  }

  /// delete the prior work from ipfs
  if (work.codeCid) {
    const existinWorkId = await getMetadataWorkId(work.codeCid);
    if (existinWorkId === work.id) {
      console.log("deleting cid ", work.codeCid);
      //only delete it if the current user owns it.
      await deleteCid(work.codeCid);
    }
  }

  //upload it to ifps pinZipToPinata
  const cid = await pinZipToPinata(tmpPath, { workId: work.id });
  if (!cid) {
    console.error("missing cid");
    throw new TRPCError({
      message: "Missing CID after uploading to IPFS",
      code: "INTERNAL_SERVER_ERROR",
    });
  }

  const updateRes = await stores().project.updateProject({
    codeCid: cid,
    id: work.id,
  });

  return true;
};

export const confirmCoverImageUpload = async (
  uploadId: string,
  work: WorkEntity
) => {
  //download the file, it should be a zip
  const upload = await stores().project.getFileUploadById(uploadId, work);
  if (!upload) {
    throw new TRPCError({
      message: "Work code was not uploaded",
      code: "NOT_FOUND",
    });
  }

  const [md] = await getBucket().file(upload.filename).getMetadata();
  const [fileContents] = await getBucket().file(upload.filename).download();

  /// delete the prior work from ipfs
  if (work.coverImageCid) {
    console.log("deleting old image cid");
    const existinWorkId = await getMetadataWorkId(work.coverImageCid);
    if (existinWorkId === work.id) {
      //only delete it if the current user owns it.
      await deleteCid(work.coverImageCid);
      console.log("deleted old image cid");
    }
  }

  //upload it to ifps pinZipToPinata
  const cid = await uploadFileToPinata(fileContents, md.contentType, {
    workId: work.id,
  });
  if (!cid) {
    console.error("missing cid");
    throw new TRPCError({
      message: "Missing CID after uploading to IPFS",
      code: "INTERNAL_SERVER_ERROR",
    });
  }

  const updateRes = await stores().project.updateProject({
    coverImageCid: cid,
    id: work.id,
  });

  return true;
};
