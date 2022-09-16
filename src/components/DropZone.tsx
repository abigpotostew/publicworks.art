import React, { FC, useCallback } from 'react'
import { DropEvent, FileRejection, useDropzone } from 'react-dropzone'

export interface DropZoneProps {
  onUpload: (files: File[]) => Promise<void>
}

export const DropZone: FC<DropZoneProps> = ({ onUpload }: DropZoneProps) => {
  const onDrop: (acceptedFiles: File[],
                 fileRejections: FileRejection[],
                 event: DropEvent) => void = useCallback(async acceptedFiles => {
    await onUpload(acceptedFiles)
  }, [onUpload])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here...</p> :
          <p>{"Drag 'n' drop some files here, or click to select files"}</p>
      }
    </div>
  )
}