import cuid from "cuid";
import { WorkEntity } from "src/model";
import { Storage } from "@google-cloud/storage";

export const getBucket = () => {
  if (!process.env.GCP_CREDENTIALS) {
    throw new Error("missing env GCP_CREDENTIALS");
  }
  const creds = JSON.parse(process.env.GCP_CREDENTIALS);

  const storage = new Storage({
    projectId: creds.project_id,
    credentials: creds,
  });
  const bucketName = `${creds.project_id}-upload-storage`;
  return storage.bucket(bucketName);
};
export const createPresignedUrl = async (work: WorkEntity) => {
  const id = cuid();
  const filename = `${work.id}/${id}.zip`;

  // Get a v4 signed URL for reading the file
  const [url] = await getBucket()
    .file(filename)
    .getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + 60 * 60 * 1000, // 15 minutes
      contentType: "application/zip",
    });

  //save this in the DB

  console.log("Generated PUT signed URL:", url);
  return { url, filename };
};
