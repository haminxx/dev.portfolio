import { Hono } from "hono";
import statusApp from "./status/app";

const app = new Hono().basePath("/api").route("/status", statusApp);

export type AppType = typeof app;
export default app;
