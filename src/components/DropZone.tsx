import React, { FC, ReactNode, useCallback } from "react";
import { DropEvent, FileRejection, useDropzone } from "react-dropzone";

export interface DropZoneProps {
  onUpload: (files: File[]) => Promise<void>;
  children?: ReactNode;
}

export const DropZone: FC<DropZoneProps> = ({
  onUpload,
  children,
}: DropZoneProps) => {
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
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
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
