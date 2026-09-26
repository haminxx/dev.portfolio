import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";

const app = new Hono();

app.get("/api", (c) => c.text("Hello Hono!"));

app.use("*", serveStatic({ root: "../web/build/client" }));
app.get("*", serveStatic({ path: "../web/build/client/index.html" }));

const port = Number(process.env["PORT"] ?? 2301);
serve({ fetch: app.fetch, port }, (info) => {
	console.log(`listening on http://localhost:${info.port}`);
});

export default app;
