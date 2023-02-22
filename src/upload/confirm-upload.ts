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

  const oldcid = work.codeCid;

  //upload it to ifps pinZipToPinata
  const cid = await pinZipToPinata(tmpPath, {
    workId: work.id,
    testnet: process.env.NEXT_PUBLIC_TESTNET === "true",
  });
  if (!cid) {
    console.error("missing cid");
    throw new TRPCError({
      message: "Missing CID after uploading to IPFS",
      code: "INTERNAL_SERVER_ERROR",
    });
  }

  const updateRes = await stores().project.updateProject(work.id, {
    codeCid: cid,
  });

  // if (updateRes.ok) {
  //   /// delete the prior work from ipfs
  //   if (oldcid && oldcid !== cid) {
  //     const existinWorkId = await getMetadataWorkId(oldcid);
  //     if (existinWorkId === work.id) {
  //       console.log(work.id, "deleting cid ", oldcid, "upload id", uploadId);
  //       //only delete it if the current user owns it.
  //       await deleteCid(oldcid);
  //     }
  //   }
  // }
  console.log("uploaded new code cid to work", cid, work.id);

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

  const oldCid = work.coverImageCid;

  //upload it to ifps pinZipToPinata
  const newCid = await uploadFileToPinata(fileContents, md.contentType, {
    workId: work.id,
  });
  if (!newCid) {
    console.error("missing cid");
    throw new TRPCError({
      message: "Missing CID after uploading to IPFS",
      code: "INTERNAL_SERVER_ERROR",
    });
  }

  const updateRes = await stores().project.updateProject(work.id, {
    coverImageCid: newCid,
  });

  // if (updateRes.ok) {
  //   /// delete the prior image from ipfs
  //   if (oldCid && oldCid !== newCid) {
  //     console.log("deleting old image cid", oldCid);
  //     const existinWorkId = await getMetadataWorkId(oldCid);
  //     if (existinWorkId === work.id) {
  //       //only delete it if the current user owns it.
  //       await deleteCid(oldCid);
  //       console.log("deleted old image cid", oldCid);
  //     }
  //   }
  // }

  return true;
};
