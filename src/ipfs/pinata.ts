import * as fs from "fs";
import * as unzipper from "unzipper";
import FormData from "form-data";
import got from "got";

export const pinZipToPinata = async (zipPath: string) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  try {
    const zip = fs
      .createReadStream(zipPath)
      .pipe(unzipper.Parse({ forceStream: true }));

    const data = new FormData();
    for await (const entry of zip) {
      const fileName = entry.path;
      const type = entry.type; // 'Directory' or 'File'
      if (type !== "File") {
        continue;
      }
      const buff = await entry.buffer();
      const filepath = "root/" + fileName;
      data.append("file", buff, {
        filepath,
      });
    }

    const response = await got(url, {
      method: "POST",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${data.getBoundary()}`,
        Authorization: "Bearer " + process.env.PINATA_API_SECRET_JWT,
      },
      body: data,
    }).on("uploadProgress", (progress) => {
      console.log(progress);
    });

    const body = JSON.parse(response.body);
    const cid = body.IpfsHash;
    console.log("cid:", cid);
    return cid;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
