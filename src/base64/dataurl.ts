export const dataUrlToBuffer = (dataUrl: string) => {
  const regex = /^data:(.+\/.+);base64,(.*)$/;

  const matches = dataUrl.match(regex);
  if (!matches) {
    throw new Error("invalid data url format");
  }
  const contentType = matches[1];
  const data = matches[2];
  return { buffer: Buffer.from(data, "base64"), contentType };
};
