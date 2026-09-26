import { Hono } from "hono";
import userApp from "../auth/user/app";
import statusApp from "./status/app";

const app = new Hono().basePath("/api").route("/status", statusApp).route("/user", userApp);

export type AppType = typeof app;
export default app;
