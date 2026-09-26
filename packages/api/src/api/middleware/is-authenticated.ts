import { createMiddleware } from "hono/factory";
import { AuthAPI } from "../../auth/api";
import type { Middleware } from "./index";

export const isAuthenticated = createMiddleware<Middleware.IsAuthenticated>(async (c, next) => {
	const session = await AuthAPI.instance().api.getSession({ headers: c.req.raw.headers });

	if (!session?.user || !session.session) {
		return c.json({ message: "Unauthorized" }, 401);
	}
	c.set("identity", { session: session.session, user: session.user });
	await next();
});
