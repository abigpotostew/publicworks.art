import fs from "fs";
import * as unzipper from "unzipper";
import { HtmlValidate } from "html-validate/node";
import tmp from "tmp";

export const unzipBufferFilesFiltered = async (
  zipPath: string,
  filenameTest: (filename: string) => boolean,
  insertBuffer: (filename: string, buffer: any) => void
) => {
  await fs
    .createReadStream(zipPath)
    .pipe(unzipper.Parse())
    .on("entry", async function (entry) {
      const fileName = entry.path;
      const type = entry.type; // 'Directory' or 'File'
      if (type === "File" && filenameTest(fileName)) {
        const buff: Buffer = await entry.buffer();
        insertBuffer(fileName, buff);
      } else {
        entry.autodrain();
        return;
      }
    })
    .promise();
};

export const containsValidIndexHtml = async (zipPath: string) => {
  let htmlFile: Buffer | null = null;
  await unzipBufferFilesFiltered(
    zipPath,
    (filename) => {
      return filename === "index.html";
    },
    (filename, buffer) => {
      // console.log("found index.html");
      htmlFile = buffer;
    }
  );
  if (!htmlFile) {
    throw new Error("index.html not found in zip");
  }
  const htmlvalidate = new HtmlValidate({
    extends: ["html-validate:recommended"],
    rules: {
      "doctype-style": "off",
      "attr-quotes": "off",
      "no-trailing-whitespace": "off",
      "void-style": "warn",
      "element-required-attributes": "off",
      "attribute-boolean-style": "off",
      "close-order": "off",
    },
  });
  const tmpobj = tmp.fileSync();
  const tmpPath = tmpobj.name;
  fs.writeFileSync(tmpPath, htmlFile);
  const report = await htmlvalidate.validateFile(tmpPath);
  if (report.errorCount > 0) {
    return { ok: false, error: "Errors with HTML" };
  }
  return { ok: true, error: undefined };
};
