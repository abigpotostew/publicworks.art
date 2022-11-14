import { WorkEntity } from "src/model";
import { getBucket } from "src/upload/presignedUrl";
import { stores } from "src/store/stores";
import tmp from "tmp";
import { deleteCid, getMetadataWorkId, pinZipToPinata } from "src/ipfs/pinata";
import { TRPCError } from "@trpc/server";
import * as fs from "fs";

function getFilesizeInBytes(filename: string) {
  const stats = fs.statSync(filename);
  const fileSizeInBytes = stats.size;
  return fileSizeInBytes;
}
export const confirmUpload = async (work: WorkEntity) => {
  //download the file, it should be a zip
  const upload = await stores().project.getLastFileUpload(work);
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

  //download it, chekc file size within limits
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
