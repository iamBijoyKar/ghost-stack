"use client";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "~/lib/utils";
import { readTextFile } from "~/server/actions/reader";

export default function MyDropzone() {
  interface FileWithPath extends File {
    path?: string;
  }

  type OnDropCallback = (acceptedFiles: FileWithPath[]) => void;

  const onDrop: OnDropCallback = useCallback((acceptedFiles) => {
    for (const file of acceptedFiles) {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = async () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result;
        console.log(await readTextFile(binaryStr as string));
      };
      reader.readAsText(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: { "text/plain": [".txt"] },
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed border-gray-300 p-6 rounded-lg text-center",
        "hover:bg-gray-100 cursor-pointer",
        "transition-colors duration-200 ease-in-out",
      )}
      aria-label="Drag and drop files here or click to select files"
    >
      <input {...getInputProps()} />
      <p>Drag 'n' drop some files here, or click to select files</p>
    </div>
  );
}
