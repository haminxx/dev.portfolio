import { Hono } from "hono";
import type { Middleware } from "../../api/middleware";
import { MiddlewareAPI } from "../../api/middleware/api";

const app = new Hono<Middleware.IsAuthenticated>()
	.use(MiddlewareAPI.isAuthenticated)
	.get("/me", (c) => c.json(c.get("identity").user));

export default app;
