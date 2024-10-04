"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import React from "react";

const Page = () => {
  const { taskId } = useParams();
  const route = useRouter();

  if (!taskId) {
    route.push("/");
  }

  const task = useQuery(api.task.getTask, {
    id: taskId as Id<"tasks">,
  });

  if (!task) {
    return (
      <div className="flex w-[80%] mx-auto border h-16 mt-28 px-8 items-center justify-between rounded-md">
        <div className="text-sm space-y-2">
          <p className="text-muted-foreground">name</p>
          loading...
        </div>
        <div className="text-sm space-y-2">
          <p className="text-muted-foreground">status</p>
          <div className="flex items-center gap-2">loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="flex w-[80%] mx-auto border h-16 mt-28 px-8 items-center justify-between rounded-md">
        <div className="text-sm space-y-2">
          <p className="text-muted-foreground">name</p>
          <p>{task?.name}</p>
        </div>
        <div className="text-sm space-y-2">
          <p className="text-muted-foreground">status</p>
          <div className="flex items-center gap-2">
            {!(task?.status === "completed") && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-loader animate-spin"
              >
                <path d="M12 2v4" />
                <path d="m16.2 7.8 2.9-2.9" />
                <path d="M18 12h4" />
                <path d="m16.2 16.2 2.9 2.9" />
                <path d="M12 18v4" />
                <path d="m4.9 19.1 2.9-2.9" />
                <path d="M2 12h4" />
                <path d="m4.9 4.9 2.9 2.9" />
              </svg>
            )}
            <p>{task?.status}</p>
          </div>
        </div>
      </div>
      {task.formats &&
        task.formats.map((format) => {
          return (
            <div
              key={format.key}
              className="w-[80%] mx-auto mt-4 border rounded-md px-4 py-6 flex items-center justify-between flex-wrap"
            >
              <p className="text-sm text-muted-foreground">{format.key}</p>
              <Button size={"sm"} variant={"outline"}>
                Download
              </Button>
            </div>
          );
        })}
    </div>
  );
};

export default Page;
