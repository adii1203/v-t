"use client";

import { UploadIcon } from "@radix-ui/react-icons";
import { useMutation } from "convex/react";
import { useRef, useState } from "react";
import { createTask } from "@/convex/task";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { getPresignedUrl } from "./actions/get-pre-url";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Page = () => {
  const [file, setFile] = useState<File | null>(null);
  const task = useMutation(api.task.createTask);

  return (
    <ConvexClientProvider>
      <div className="flex grow flex-col">
        <div className="container mb-20 flex grow flex-col">
          <h1 className="mb-8 mt-8 flex flex-col items-center gap-8 text-center text-6xl font-extrabold leading-none tracking-tight">
            Video Transcode
          </h1>
          <div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="picture">Picture</Label>
              <Input
                id="picture"
                type="file"
                onChange={(e) => {
                  if (e.target.files) {
                    const file = e.target.files?.[0];
                    setFile(file);
                  }
                }}
              />
            </div>
            <Button
              onClick={async () => {
                console.log("clicked");

                const taskId = await task();
                console.log(taskId);

                const url = await getPresignedUrl(taskId + ".mp4");
                console.log(url);
                const renameFile = new File([file as Blob], taskId + ".mp4", {
                  type: file!.type,
                });
                console.log(renameFile);

                const res = await fetch(url, {
                  method: "PUT",
                  body: renameFile,
                });
                console.log(res);
              }}
            >
              <div className="flex items-center justify-center">
                <UploadIcon className="w-5 h-5 mr-2" />
                Upload
              </div>
            </Button>
          </div>
        </div>
      </div>
    </ConvexClientProvider>
  );
};

export default Page;
