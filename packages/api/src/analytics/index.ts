import { z } from "zod";
import { parse as parseAgent } from "./agent";

export namespace Analytics {
	/** Readable by the browser so the banner knows whether to show. */
	export const ConsentCookie = "cjl_consent";
	/** HttpOnly. The first-party visitor id, written only after consent. */
	export const VisitorCookie = "cjl_vid";
	export const CookieMaxAge = 60 * 60 * 24 * 180;

	export const Consent = z.object({
		granted: z.boolean(),
		categories: z.record(z.string(), z.boolean()).optional(),
	});
	export type Consent = z.infer<typeof Consent>;

	export const Visit = z.object({
		path: z.string().min(1).max(2048),
		referrer: z.string().max(2048).optional(),
		language: z.string().max(64).optional(),
		screen: z.string().max(32).optional(),
		utm: z.record(z.string(), z.string().max(256)).optional(),
	});
	export type Visit = z.infer<typeof Visit>;

	export type Agent = { browser: string | null; os: string | null; device: string | null };
	export const agent = parseAgent;

	export type Place = {
		country: string | null;
		region: string | null;
		city: string | null;
		latitude: number | null;
		longitude: number | null;
		timezone: string | null;
	};

	export type Visitor = {
		id: string;
		name: string | null;
		email: string | null;
		avatar_url: string | null;
		auth_user_id: string | null;
		is_owner: boolean;
		visit_count: number;
		first_seen_at: string;
		last_seen_at: string;
	};

	export type VisitRow = {
		id: number;
		occurred_at: string;
		path: string | null;
		referrer: string | null;
		country: string | null;
		region: string | null;
		city: string | null;
		browser: string | null;
		os: string | null;
		device: string | null;
		language: string | null;
		screen: string | null;
		utm: Record<string, string> | null;
		visitor: Pick<Visitor, "id" | "name" | "email" | "avatar_url" | "is_owner"> | null;
	};

	export type Daily = { day: string; visits: number; unique_visitors: number };

	export type Message = {
		id: number;
		name: string | null;
		email: string | null;
		message: string;
		created_at: string;
		read_at: string | null;
	};

	export type Dashboard = {
		totals: { visits: number; visitors: number };
		visits: VisitRow[];
		daily: Daily[];
		messages: Message[];
	};

	/** The dashboard polls instead of holding a Supabase key in the browser. */
	export const PollInterval = 10_000;
}
