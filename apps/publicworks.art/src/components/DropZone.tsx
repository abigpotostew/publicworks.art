import React, { FC, ReactNode, useCallback } from "react";
import { Accept, DropEvent, FileRejection, useDropzone } from "react-dropzone";

export interface DropZoneProps {
  onUpload: (files: File[]) => Promise<void>;
  children?: ReactNode;
  accept: "zip" | "images";
  maxSize?: number;
  maxFiles?: number;
}

export const DropZone: FC<DropZoneProps> = ({
  onUpload,
  children,
  accept,
  maxFiles,
  maxSize,
}: DropZoneProps) => {
  const [error, setError] = React.useState<string | null>(null);
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
          "image/svg+xml": [],
        };
  const onDrop: (
    acceptedFiles: File[],
    fileRejections: FileRejection[],
    event: DropEvent
  ) => void = useCallback(
    async (acceptedFiles) => {
      setError(null);
      await onUpload(acceptedFiles);
    },
    [onUpload]
  );
  const onDropRejected = (
    fileRejections: FileRejection[],
    event: DropEvent
  ) => {
    console.log("rejected", fileRejections);
    setError(fileRejections.map((e) => e.errors[0].message).join(", "));
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    maxFiles: maxFiles || 1,
    maxSize: maxSize || 50_000_000,
    accept: acceptProp,
  });
  // message =
  //   message || "Drag 'n' drop some files here, or click to select files";
  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <div className={"tw-border-1 tw-border-dashed tw-p-4"}>
        {isDragActive ? (
          <p>Drop the files here...</p>
        ) : (
          <>
            {children ||
              "Drag 'n' drop some files here, or click to select files"}
          </>
        )}
      </div>
      {error && <p>{error}</p>}
    </div>
  );
};
