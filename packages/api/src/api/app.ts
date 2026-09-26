import { Hono } from "hono";
import authApp from "../auth/app";
import routes from "./routes";

const app = new Hono().route("/api/auth", authApp).route("/", routes);

export default app;
