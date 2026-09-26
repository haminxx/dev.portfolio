import { Hono } from "hono";
import { AuthAPI } from "./api";

const app = new Hono().on(["POST", "GET"], "*", (c) => AuthAPI.instance().handler(c.req.raw));

export default app;
