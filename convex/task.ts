import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const createTask = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.insert("tasks", {
      status: "created",
    });
  },
});

export const upDateTask = mutation({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.taskId, {
      status: "running",
    });
  },
});
