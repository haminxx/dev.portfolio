import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import app from "./api/app";

const server = new Hono()
	.route("/", app)
	.use("*", serveStatic({ root: "../web/build/client" }))
	.get("*", serveStatic({ path: "../web/build/client/index.html" }));

const port = Number(process.env["PORT"] ?? 8666);
serve({ fetch: server.fetch, port }, (info) => {
	console.log(`listening on http://localhost:${info.port}`);
});
