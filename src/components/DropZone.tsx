import React, { FC, ReactNode, useCallback } from "react";
import { Accept, DropEvent, FileRejection, useDropzone } from "react-dropzone";

export interface DropZoneProps {
  onUpload: (files: File[]) => Promise<void>;
  children?: ReactNode;
  accept: "zip" | "images";
}

export const DropZone: FC<DropZoneProps> = ({
  onUpload,
  children,
  accept,
}: DropZoneProps) => {
  const acceptProp: Accept =
    accept === "zip"
      ? {
          "application/zip": [],
          "application/x-zip-compressed": [],
        }
      : {
          "image/jpeg": [],
          "image/png": [],
          "image/gif": [],
        };
  const onDrop: (
    acceptedFiles: File[],
    fileRejections: FileRejection[],
    event: DropEvent
  ) => void = useCallback(
    async (acceptedFiles) => {
      await onUpload(acceptedFiles);
    },
    [onUpload]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 50_000_000,
    accept: acceptProp,
  });
  // message =
  //   message || "Drag 'n' drop some files here, or click to select files";
  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here...</p>
      ) : (
        <p>
          {children ||
            "Drag 'n' drop some files here, or click to select files"}
        </p>
      )}
    </div>
  );
};
