import * as fs from "fs";
import * as unzipper from "unzipper";
import FormData from "form-data";
import got from "got";
import AdmZip from "adm-zip";

const readZipAdm = async (
  zipPath: string,
  insertBuffer: (filename: string, buffer: any) => void
) => {
  const zip = new AdmZip(zipPath);
  const zipEntries = zip.getEntries(); // an array of ZipEntry records
  zipEntries.forEach(function (zipEntry) {
    if (zipEntry.isDirectory) {
      return;
    }
    insertBuffer(zipEntry.entryName, zipEntry.getData());
  });
  console.log("done reading readZipAdm", zipPath);
};
const readZip = async (
  zipPath: string,
  insertBuffer: (filename: string, buffer: any) => void
) => {
  await fs
    .createReadStream(zipPath)
    // .pipe(unzipper.Parse({ forceStream: true }));
    .pipe(unzipper.Parse())
    .on("entry", async function (entry) {
      const fileName = entry.path;
      const type = entry.type; // 'Directory' or 'File'
      if (type !== "File") {
        entry.autodrain();
        return;
      }
      const buff = await entry.buffer();

      insertBuffer(fileName, buff);
      // data.append("file", buff, {
      //   filepath,
      // });
    })
    .promise();
  // for await (const entry of zip) {
  //   const fileName = entry.path;
  //   const type = entry.type; // 'Directory' or 'File'
  //   if (type !== "File") {
  //     continue;
  //   }
  //   const buff = await entry.buffer();
  //   const filepath = "root/" + fileName;
  //   data.append("file", buff, {
  //     filepath,
  //   });
  // }
};

export const pinZipToPinata = async (
  zipPath: string,
  metadata: { workId: string }
) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  try {
    const data = new FormData();
    data.append("pinataOptions", '{"cidVersion": 1}');
    data.append(
      "pinataMetadata",
      JSON.stringify({
        name: `work-${metadata.workId}-${Math.round(Date.now() / 1000)}`,
        keyvalues: { workId: metadata.workId },
      })
    );
    // readZip(zipPath, (filepath, buff) => {
    //   data.append("file", buff, {
    //     filepath,
    //   });
    // });
    await readZipAdm(zipPath, (filepath, buff) => {
      data.append("file", buff, {
        filepath: "root/" + filepath,
      });
    });
    // await fs
    //   .createReadStream(zipPath)
    //   // .pipe(unzipper.Parse({ forceStream: true }));
    //   .pipe(unzipper.Parse())
    //   .on("entry", async function (entry) {
    //     const fileName = entry.path;
    //     const type = entry.type; // 'Directory' or 'File'
    //     if (type !== "File") {
    //       entry.autodrain();
    //       return;
    //     }
    //     const buff = await entry.buffer();
    //     const filepath = "root/" + fileName;
    //     data.append("file", buff, {
    //       filepath,
    //     });
    //   })
    //   .promise();

    const response = await got(url, {
      method: "POST",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${data.getBoundary()}`,
        Authorization: "Bearer " + process.env.PINATA_API_SECRET_JWT,
      },
      body: data,
    });

    const body = JSON.parse(response.body);
    const cid = body.IpfsHash as string;
    console.log("cid:", cid);
    return cid;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteCid = async (cid: string) => {
  const config = {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + process.env.PINATA_API_SECRET_JWT,
    },
  };

  const res = await fetch(
    `https://api.pinata.cloud/pinning/unpin/${cid}`,
    config
  );
  if (!res.ok) {
    console.log(`failed to delete cid ${cid}:` + (await res.text()));
    return;
  }
};

export const getMetadataWorkId = async (searchCid: string) => {
  //
  const config = {
    method: "GET",
    headers: {
      Authorization: "Bearer " + process.env.PINATA_API_SECRET_JWT,
    },
  };
  const res = await fetch(
    `https://api.pinata.cloud/data/pinList?hashContains=${searchCid}`,
    config
  );
  if (!res.ok) {
    return null;
  }
  const body = await res.json();
  if (Array.isArray(body?.rows)) {
    const row = body.rows.find(
      (r: any) => r.date_unpinned === null && r.metadata?.keyvalues?.workId
    );
    return row?.metadata?.keyvalues?.workId || null;
  }
  return null;
};

export const uploadFileToPinata = async (
  buffer: Buffer,
  contentType: string,
  metadata: { workId: string }
) => {
  //

  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  try {
    const data = new FormData();
    data.append("pinataOptions", '{"cidVersion": 1}');
    data.append(
      "pinataMetadata",
      JSON.stringify({
        name: `work-${metadata.workId}-${Math.round(Date.now() / 1000)}`,
        keyvalues: { workId: metadata.workId },
      })
    );
    data.append("file", buffer, {
      filename: "image",
      contentType: contentType,
    });

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
    const cid = body.IpfsHash as string;
    console.log("cid:", cid);
    return cid;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
