import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";
import { Id } from "./_generated/dataModel";

export const updateAction = httpAction(async (ctx, request) => {
  // extract taskId from url query params
  const taskId = new URL(request.url).searchParams.get("taskId");
  const status = new URL(request.url).searchParams.get("status");

  const tasks = await ctx.runMutation(api.task.updateTask, {
    taskId: taskId as Id<"tasks">,
    status: status || "running",
  });
  return new Response(
    JSON.stringify({
      tasks: tasks,
      message: "Hello, World!",
    }),
    {
      status: 200,
    },
  );
});

export const successAction = httpAction(async (ctx, request) => {
  const { data, taskId } = await request.json();

  await ctx.runMutation(api.task.updateFormats, {
    id: taskId,
    formats: data,
  });
  return new Response(
    JSON.stringify({
      message: data,
    }),
    {
      status: 200,
    },
  );
});

export const createTask = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tasks", {
      status: "uploading",
      name: args.name,
    });
  },
});

export const getAllTasks = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").collect();
  },
});

export const updateTask = mutation({
  args: {
    taskId: v.id("tasks"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.taskId, {
      status: args.status,
    });
  },
});

export const updateFormats = mutation({
  args: {
    id: v.id("tasks"),
    formats: v.array(v.object({ key: v.string(), value: v.string() })),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      formats: args.formats,
    });
  },
});

export const getTask = query({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    console.log(args.id);

    const task = await ctx.db.get(args.id);
    return task;
  },
});
