import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, afterEach, beforeEach, expect, test, vi } from "vitest";

const dir = mkdtempSync(join(tmpdir(), "tomo-analytics-"));
process.env.ENVIRONMENT = "development";
process.env.DATABASE_PATH = join(dir, "tomo.db");
process.env.BETTER_AUTH_SECRET = "test-secret-test-secret-test-secret";
process.env.SUPABASE_URL = "https://project.supabase.co";
process.env.SUPABASE_SECRET_KEY = "sb_secret_test";
process.env.OWNER_EMAILS = "owner@example.com";

const { makeSignature } = await import("better-auth/crypto");
const { DbAPI } = await import("../src/api/db/api");
const { Analytics } = await import("../src/analytics");
const { AuthAPI } = await import("../src/auth/api");
const { User } = await import("../src/auth/user");
const { OwnerAPI } = await import("../src/owner/api");
const app = (await import("../src/api/app")).default;

DbAPI.migrate(DbAPI.instance());

async function sessionCookie(args: { id: string; email: string }) {
	const now = new Date();
	DbAPI.instance()
		.insert(User.Table)
		.values({
			id: args.id,
			name: args.id,
			email: args.email,
			emailVerified: true,
			createdAt: now,
			updatedAt: now,
		})
		.onConflictDoNothing()
		.run();
	const ctx = await AuthAPI.instance().$context;
	const session = await ctx.internalAdapter.createSession(args.id);
	const signature = await makeSignature(session.token, ctx.secret);
	return `${ctx.authCookies.sessionToken.name}=${session.token}.${signature}`;
}

type Call = { method: string; path: string; body: unknown };

const calls: Call[] = [];
const realFetch = globalThis.fetch;

function json(body: unknown, init?: ResponseInit) {
	return new Response(JSON.stringify(body), {
		status: 200,
		headers: { "content-type": "application/json" },
		...init,
	});
}

/** Stands in for PostgREST so no test ever reaches the network. */
function supabase(request: Call) {
	if (request.method === "HEAD") {
		return new Response(null, { status: 200, headers: { "content-range": "0-0/7" } });
	}
	if (request.path.startsWith("/rest/v1/visitors") && request.method === "GET") {
		const known = request.path.includes("anon_id=eq.known");
		return json(known ? [{ id: "visitor-1", name: null, email: null, avatar_url: null }] : []);
	}
	if (request.path.startsWith("/rest/v1/visitors") && request.method === "POST") {
		return json([{ id: "visitor-1", name: null, email: null, avatar_url: null, is_owner: false }]);
	}
	return json([{ id: 1 }]);
}

beforeEach(() => {
	calls.length = 0;
	globalThis.fetch = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
		const url = new URL(typeof input === "string" ? input : input.toString());
		if (url.host !== "project.supabase.co") throw new Error(`unexpected fetch to ${url.host}`);
		const call: Call = {
			method: init?.method ?? "GET",
			path: `${url.pathname}${url.search}`,
			body: typeof init?.body === "string" ? JSON.parse(init.body) : undefined,
		};
		calls.push(call);
		return supabase(call);
	}) as unknown as typeof fetch;
});

afterEach(() => {
	globalThis.fetch = realFetch;
});

afterAll(() => {
	rmSync(dir, { recursive: true, force: true });
});

function post(path: string, body: unknown, headers: Record<string, string> = {}) {
	return app.request(path, {
		method: "POST",
		headers: { "content-type": "application/json", ...headers },
		body: JSON.stringify(body),
	});
}

test("a visit without consent is not recorded and never reaches Supabase", async () => {
	const response = await post("/api/analytics/visit", { path: "/" });

	expect(response.status).toBe(200);
	await expect(response.json()).resolves.toEqual({ ok: true, recorded: false });
	expect(calls).toHaveLength(0);
});

test("a visit with a consent cookie but no visitor id is not recorded", async () => {
	const response = await post(
		"/api/analytics/visit",
		{ path: "/" },
		{ cookie: `${Analytics.ConsentCookie}=granted` },
	);

	await expect(response.json()).resolves.toEqual({ ok: true, recorded: false });
	expect(calls).toHaveLength(0);
});

test("granting consent sets both cookies and records the grant", async () => {
	const response = await post("/api/analytics/consent", {
		granted: true,
		categories: { analytics: true },
	});

	const cookies = response.headers.getSetCookie().join("\n");
	expect(cookies).toContain(`${Analytics.ConsentCookie}=granted`);
	expect(cookies).toMatch(new RegExp(`${Analytics.VisitorCookie}=[^;]+;.*HttpOnly`, "s"));
	await expect(response.json()).resolves.toEqual({ ok: true, recorded: true });

	const event = calls.find((call) => call.path.startsWith("/rest/v1/consent_events"));
	expect(event?.body).toMatchObject({ granted: true, categories: { analytics: true } });
});

test("revoking consent clears the visitor cookie and records the revoke", async () => {
	const response = await post(
		"/api/analytics/consent",
		{ granted: false },
		{ cookie: `${Analytics.ConsentCookie}=granted; ${Analytics.VisitorCookie}=known` },
	);

	const cookies = response.headers.getSetCookie().join("\n");
	expect(cookies).toContain(`${Analytics.ConsentCookie}=denied`);
	expect(cookies).toMatch(new RegExp(`${Analytics.VisitorCookie}=;`));

	const event = calls.find((call) => call.path.startsWith("/rest/v1/consent_events"));
	expect(event?.body).toMatchObject({ granted: false, anon_id: "known" });
	expect(calls.some((call) => call.path.startsWith("/rest/v1/visits"))).toBe(false);
});

test("a consented visit stores the page, parsed agent and edge geo", async () => {
	const response = await post(
		"/api/analytics/visit",
		{ path: "/?utm_source=ig", language: "en-CA", screen: "1920x1080", utm: { utm_source: "ig" } },
		{
			cookie: `${Analytics.ConsentCookie}=granted; ${Analytics.VisitorCookie}=known`,
			"user-agent":
				"Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
			"cf-ipcountry": "CA",
			"cf-ipcity": "Toronto",
		},
	);

	await expect(response.json()).resolves.toEqual({ ok: true, recorded: true });
	const visit = calls.find((call) => call.path.startsWith("/rest/v1/visits"));
	expect(visit?.body).toMatchObject({
		visitor_id: "visitor-1",
		path: "/?utm_source=ig",
		browser: "Safari",
		os: "iOS",
		device: "mobile",
		country: "CA",
		city: "Toronto",
		language: "en-CA",
		screen: "1920x1080",
		utm: { utm_source: "ig" },
	});
});

test("the dashboard is closed to visitors who are not the owner", async () => {
	const response = await app.request("/api/analytics/dashboard");

	expect(response.status).toBe(403);
	expect(calls).toHaveLength(0);
});

test("a signed-in visitor who is not the owner still cannot see the dashboard", async () => {
	const cookie = await sessionCookie({ id: "someone", email: "someone@example.com" });
	const response = await app.request("/api/analytics/dashboard", { headers: { cookie } });

	expect(response.status).toBe(403);
	expect(calls).toHaveLength(0);
});

test("the owner sees visits, daily counts and messages", async () => {
	const cookie = await sessionCookie({ id: "owner", email: "owner@example.com" });
	const response = await app.request("/api/analytics/dashboard", { headers: { cookie } });

	expect(response.status).toBe(200);
	await expect(response.json()).resolves.toMatchObject({ totals: { visits: 7, visitors: 7 } });
	const paths = calls.map((call) => call.path);
	expect(paths.some((path) => path.includes("visitor:visitors"))).toBe(true);
	expect(paths.some((path) => path.startsWith("/rest/v1/visit_daily"))).toBe(true);
	expect(paths.some((path) => path.startsWith("/rest/v1/contact_messages"))).toBe(true);
});

test("owner emails come from OWNER_EMAILS and ignore case and spacing", () => {
	expect(OwnerAPI.is("owner@example.com")).toBe(true);
	expect(OwnerAPI.is("  Owner@Example.com ")).toBe(true);
	expect(OwnerAPI.is("someone@example.com")).toBe(false);
	expect(OwnerAPI.is(undefined)).toBe(false);
});

test("user agents are parsed into browser, os and device", () => {
	expect(
		Analytics.agent(
			"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
		),
	).toEqual({ browser: "Chrome", os: "macOS", device: "desktop" });

	expect(
		Analytics.agent(
			"Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36",
		),
	).toEqual({ browser: "Chrome", os: "Android", device: "mobile" });

	expect(
		Analytics.agent(
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0",
		),
	).toEqual({ browser: "Edge", os: "Windows", device: "desktop" });

	expect(Analytics.agent("Googlebot/2.1 (+http://www.google.com/bot.html)").device).toBe("bot");
	expect(Analytics.agent(null)).toEqual({ browser: null, os: null, device: null });
});
