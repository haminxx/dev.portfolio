import { Hono } from "hono";
import { Core } from "../../core";

const app = new Hono();

app.get("/", (c) => {
	return c.json({ status: "ok", version: Core.VERSION });
});

export default app;
