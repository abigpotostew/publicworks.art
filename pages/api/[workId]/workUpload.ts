// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import multiparty from "multiparty";
import * as fs from "fs";
import {
  deleteCid,
  getMetadataWorkId,
  pinZipToPinata,
} from "../../../src/ipfs/pinata";
import { stores } from "../../../src/store/stores";
import { getContext } from "../../../src/server/trpc";
import { initializeIfNeeded } from "../../../src/typeorm/datasource";
import { ipfsUrl } from "../../../src/ipfs/gateway";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(404).json({ message: "not found" });
    return;
  }

  try {
    await initializeIfNeeded();

    const ctx = await getContext(req);
    if (!ctx.authorized || !ctx.user) {
      res.status(401).json({ message: "unauthorized" });
      return;
    }

    const { workId } = req.query;

    if (typeof workId !== "string" || !Number.isFinite(parseInt(workId))) {
      res.status(400).json({ message: "bad id" });
      return;
    }

    const work = await stores().project.getProject(workId);

    if (work?.owner.id !== ctx.user.id) {
      res.status(404).json({ message: "not found" });
      return;
    }

    const form = new multiparty.Form({
      maxFilesSize: 50_000_000,
      autoFiles: true,
    });
    let data: any;
    try {
      data = await new Promise<any>((resolve, reject) => {
        form.parse(req, function (err, fields, files) {
          if (err) reject({ err });
          resolve({ fields, files });
        });
      });
      try {
        console.log(`data: `, data.toString());
        console.log("files type", typeof data?.files);
        console.log("files keys", Object.keys(data?.files || {}));
        console.log("files", data?.files?.toString());
      } catch (e) {
        //ignored
      }
      // console.log(`data: `, JSON.stringify(data));
      if (Object.keys(data.files).length !== 1) {
        console.error("too many file in multipart");
        res.status(400).json({ name: "too many 'file'" });
        return;
      }
      const file = data.files["file"];
      if (!file) {
        console.error("missing file in multipart");
        res.status(400).json({ name: "missing 'file'" });
        return;
      }
      if (file.length !== 1) {
        console.error("multiple file entries in multipart");
        res.status(400).json({ name: "multiple 'file' entries" });
        return;
      }
      const fileObj = file[0];

      if (fileObj.headers["content-type"] !== "application/zip") {
        console.error("not zip file type");
        res.status(400).json({ name: "not application/zip" });
        return;
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
      // const project = stores().project.getProject(workId);
      //upload to pinata and set the url.
      const tmpPath = fileObj.path;
      const cid = await pinZipToPinata(tmpPath, { workId: work.id });
      if (!cid) {
        console.error("missing cid");
        res.status(400).json({ message: "cid missing" });
        return;
      }

      const updateRes = await stores().project.updateProject({
        codeCid: cid,
        id: work.id,
      });
      if (!updateRes.ok) {
        console.error("failed to upload, error:", updateRes.error);
        return res.status(500).json({ message: "failed to upload" });
      }

      return res.status(200).json({ url: ipfsUrl(cid) });
    } finally {
      if (data?.files) {
        for (const fileName of Object.keys(data.files)) {
          const fileArr = data.files[fileName];
          for (const file of fileArr) {
            try {
              fs.rmSync(file.path, {
                force: true,
              });
              console.log("deleted", file.path);
            } catch (e) {
              console.error("failed to delete");
            }
          }
        }
      }
    }
  } catch (e) {
    console.error("Error uploading work: ", e);
    res.status(500).json({
      message:
        "something went wrong uploading your work." + (e as any)?.message,
    });
  }
}
export const config = {
  api: {
    bodyParser: false,
  },
};
