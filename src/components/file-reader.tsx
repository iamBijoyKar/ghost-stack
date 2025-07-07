"use client";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "~/lib/utils";
import { readTextFile } from "~/server/actions/reader";
import { FileUp } from "lucide-react";
import { motion, useAnimate } from "motion/react";

type MyDropzoneProps = {
  setAppData: (data: any[]) => void;
};

export default function MyDropzone({ setAppData }: MyDropzoneProps) {
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
        // console.log(await readTextFile(binaryStr as string));
        const appData = await readTextFile(binaryStr as string);
        setAppData(appData);
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
        "flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 text-center",
        "hover:bg-secondary cursor-pointer",
        "transition-colors duration-200 ease-in-out",
        "h-full w-full",
      )}
      aria-label="Drag and drop files here or click to select files"
    >
      <input {...getInputProps()} />
      <div
        className={`flex flex-col items-center justify-center ${isDragActive ? "motion-translate-y-loop-25" : ""}`}
      >
        <FileUp className="h-12 w-12" />
        <p className="text-muted-foreground mt-2 text-sm">
          Drag 'n' drop some files here, <br /> or click to select files
        </p>
      </div>
    </div>
  );
}
