import { httpRouter } from "convex/server";
import { updateAction, successAction } from "./task";

const http = httpRouter();

http.route({
  path: "/tasks",
  method: "GET",
  handler: updateAction,
});

http.route({
  path: "/tasks/success",
  method: "POST",
  handler: successAction,
});

export default http;
