import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import type { CookieOptions } from "hono/utils/cookie";
import { Env } from "../api/env";
import { AuthAPI } from "../auth/api";
import { Core } from "../core";
import { OwnerAPI } from "../owner/api";
import { Analytics } from ".";
import { AnalyticsAPI } from "./api";

function options(): CookieOptions {
	return {
		path: "/",
		sameSite: "Lax",
		secure: Env.ENVIRONMENT === "production",
		maxAge: Analytics.CookieMaxAge,
	};
}

async function identity(headers: Headers) {
	const session = await AuthAPI.instance()
		.api.getSession({ headers })
		.catch(() => null);
	return AnalyticsAPI.identity(session?.user);
}

const app = new Hono()
	.get("/me", async (c) => {
		const user = await identity(c.req.raw.headers);
		return c.json({ owner: OwnerAPI.is(user?.email), enabled: AnalyticsAPI.enabled() });
	})
	.post("/consent", zValidator("json", Analytics.Consent), async (c) => {
		const input = c.req.valid("json");
		const anonId = getCookie(c, Analytics.VisitorCookie) ?? Core.Id();

		if (!input.granted) {
			deleteCookie(c, Analytics.VisitorCookie, { path: "/" });
			setCookie(c, Analytics.ConsentCookie, "denied", { ...options(), httpOnly: false });
		} else {
			setCookie(c, Analytics.VisitorCookie, anonId, { ...options(), httpOnly: true });
			setCookie(c, Analytics.ConsentCookie, "granted", { ...options(), httpOnly: false });
		}

		if (!AnalyticsAPI.enabled()) return c.json({ ok: true, recorded: false });
		try {
			const user = await identity(c.req.raw.headers);
			await AnalyticsAPI.consent({
				anonId,
				granted: input.granted,
				...(input.categories ? { categories: input.categories } : {}),
				...(user ? { identity: user } : {}),
			});
			return c.json({ ok: true, recorded: true });
		} catch (error) {
			console.error("analytics consent failed", error);
			return c.json({ ok: true, recorded: false });
		}
	})
	.post("/visit", zValidator("json", Analytics.Visit), async (c) => {
		const granted = getCookie(c, Analytics.ConsentCookie) === "granted";
		const anonId = getCookie(c, Analytics.VisitorCookie);
		if (!granted || !anonId) return c.json({ ok: true, recorded: false });
		if (!AnalyticsAPI.enabled()) return c.json({ ok: true, recorded: false });

		try {
			const user = await identity(c.req.raw.headers);
			await AnalyticsAPI.visit({
				anonId,
				input: c.req.valid("json"),
				headers: c.req.raw.headers,
				...(user ? { identity: user } : {}),
			});
			return c.json({ ok: true, recorded: true });
		} catch (error) {
			console.error("analytics visit failed", error);
			return c.json({ ok: true, recorded: false });
		}
	})
	.get("/dashboard", async (c) => {
		const user = await identity(c.req.raw.headers);
		if (!OwnerAPI.is(user?.email)) return c.json({ message: "Forbidden" }, 403);
		if (!AnalyticsAPI.enabled()) return c.json({ message: "Analytics is not configured" }, 503);
		try {
			return c.json(await AnalyticsAPI.dashboard());
		} catch (error) {
			console.error("analytics dashboard failed", error);
			return c.json({ message: "Analytics is unavailable" }, 502);
		}
	});

export default app;
