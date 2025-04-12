"use client";

import { UploadIcon } from "@radix-ui/react-icons";
import { useMutation } from "convex/react";
import React, { useRef, useState } from "react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { getPresignedUrl } from "./actions/get-pre-url";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

const Page = () => {
  const [file, setFile] = useState<File | null>(null);
  const createTask = useMutation(api.task.createTask);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  const updateTask = useMutation(api.task.updateTask);

  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handelDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else {
      setDragActive(false);
    }
  };

  const handelDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handelUpload = async () => {
    if (!file) {
      return;
    }
    try {
      setIsUploading(true);
      const taskId = await createTask({ name: file.name });
      if (!taskId) {
        throw new Error("Something went wrong while creating task");
      }

      const url = await getPresignedUrl(taskId + ".mp4");
      if (!url) {
        throw new Error("Something went wrong while getting presigned url");
      }

      const renameFile = new File([file as Blob], taskId + ".mp4", {
        type: file!.type,
      });
      console.log(renameFile);

      router.push(`/tasks/${taskId}`);
      const res = await fetch(url, {
        method: "PUT",
        body: renameFile,
      });
      if (!res.ok) {
        throw new Error("Something went wrong while uploading file");
      }
      await updateTask({
        taskId,
        status: "pending",
      });
      console.log(res);
    } catch (error) {
      console.log(error);
    } finally {
      setIsUploading(false);
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div className="w-full container">
        <div className="mt-20 py-10 text-center flex flex-col gap-10">
          <h1 className="text-3xl font-medium">
            Convert videos in different format
          </h1>
          <div className="">
            <div
              className="max-w-96 mx-auto px-3 py-4 space-y-2 bg-background rounded-lg"
              style={{
                boxShadow: `rgba(0, 0, 0, 0.20) 0px 0px 15px`,
              }}
            >
              <form
                className="flex items-center justify-center w-full"
                onSubmit={(e) => e.preventDefault()}
                onDragEnter={handelDrag}
              >
                <Label
                  htmlFor="dropzone-file"
                  className={`flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-lg cursor-pointer border-muted`}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadIcon className="w-6 h-6 mb-3 text-foreground" />
                    <div className="flex flex-col gap-1">
                      <Button onClick={onButtonClick} size={"sm"}>
                        Browse file
                      </Button>
                      <p className="text-sm text-muted-foreground font-normal">
                        or drag the file here
                      </p>
                    </div>
                  </div>
                  <Input
                    ref={inputRef}
                    onChange={handelChange}
                    type="file"
                    id="dropzone-file"
                    className="hidden"
                  />
                </Label>
                {dragActive && (
                  <div
                    className="absolute inset-0 w-full h-full"
                    onDragEnter={handelDrag}
                    onDragOver={handelDrag}
                    onDragLeave={handelDrag}
                    onDrop={handelDrop}
                  ></div>
                )}
              </form>
              {file && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {file && file.name && file.name.length > 20
                      ? file.name.slice(0, 20)
                      : file?.name}
                  </p>
                  <Button
                    onClick={handelUpload}
                    disabled={isUploading}
                    size={"sm"}
                  >
                    {isUploading ? "uploading..." : "upload"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
