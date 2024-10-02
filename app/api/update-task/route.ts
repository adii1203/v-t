import { api } from "@/convex/_generated/api";
import { convexHttpClient } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { Id } from "@/convex/_generated/dataModel";

export async function GET(req: NextRequest, res: NextResponse) {
  const taskId = req.nextUrl.searchParams.get("taskId");
  console.log("taskId", taskId);
  if (taskId) {
    convexHttpClient.mutation(api.task.upDateTask, {
      taskId: taskId as Id<"tasks">,
    });
  }

  return NextResponse.json(
    {
      taskId,
    },
    {
      status: 200,
    },
  );
}
