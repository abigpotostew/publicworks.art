import { WorkEntity } from "src/store/model";
import { getBucket } from "src/upload/presignedUrl";
import { stores } from "src/store/stores";
import tmp from "tmp";
import { pinZipToPinata, uploadFileToPinata } from "src/ipfs/pinata";
import { TRPCError } from "@trpc/server";
import * as fs from "fs";
import { containsValidIndexHtml } from "../zip/unzip";
import chainInfo from "../stargaze/chainInfo";
import {
  invalidOrMissingHTMLFileError,
  workCodeSizeLimitIs50mbError,
} from "../constants/constants";

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
  const filePt = getBucket().file(upload.filename);
  await filePt.download({ destination: tmpobj.name });

  const deleteFile = async () => {
    console.log(
      "invalid html file, deleting work upload",
      uploadId,
      work.id,
      chainInfo().chainId
    );
    //cleanup the file from gcp.
    await filePt.delete({
      ignoreNotFound: true,
    });
    const upload = await stores().project.deleteFileUploadEntry(uploadId);
  };

  if (getFilesizeInBytes(tmpobj.name) > 50_000_000) {
    await deleteFile();
    return { ok: false, error: workCodeSizeLimitIs50mbError };
  }

  const { ok } = await containsValidIndexHtml(tmpPath);
  if (!ok) {
    await deleteFile();
    return { ok: false, error: invalidOrMissingHTMLFileError };
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
    hidden: work.hidden,
    startDate: (work.startDate || new Date(0)).toISOString(),
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
  // tmpobj.removeCallback();
  return { ok: true, error: null };
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
    hidden: work.hidden,
    startDate: (work.startDate || new Date(0)).toISOString(),
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
