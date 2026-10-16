import { Guest } from "../guest";
import { OwnerAPI } from "../owner/api";
import { Analytics } from ".";
import { GeoAPI } from "./geo";
import { SupabaseAPI } from "./supabase";

export namespace AnalyticsAPI {
	export type Identity = {
		id: string;
		name?: string | null | undefined;
		email?: string | null | undefined;
		image?: string | null | undefined;
	};

	export function enabled() {
		return SupabaseAPI.enabled();
	}

	/** The shared guest session is not a person, so it never becomes an identity. */
	export function identity(user: Identity | null | undefined): Identity | undefined {
		if (!user || user.id === Guest.UserId) return undefined;
		return user;
	}

	function profile(identity: Identity | undefined) {
		if (!identity) return {};
		return {
			auth_user_id: identity.id,
			name: identity.name ?? null,
			email: identity.email ?? null,
			avatar_url: identity.image ?? null,
			is_owner: OwnerAPI.is(identity.email),
		};
	}

	function stale(visitor: Analytics.Visitor, identity: Identity | undefined) {
		const next = profile(identity);
		if (Object.keys(next).length === 0) return undefined;
		const changed = Object.entries(next).filter(
			([key, value]) => visitor[key as keyof Analytics.Visitor] !== value,
		);
		return changed.length > 0 ? Object.fromEntries(changed) : undefined;
	}

	async function byAuthId(id: string) {
		const [row] = await SupabaseAPI.select<Analytics.Visitor>(
			`visitors?select=*&auth_user_id=eq.${SupabaseAPI.filter(id)}&limit=1`,
		);
		return row;
	}

	async function byAnonId(anonId: string) {
		const [row] = await SupabaseAPI.select<Analytics.Visitor>(
			`visitors?select=*&anon_id=eq.${SupabaseAPI.filter(anonId)}&limit=1`,
		);
		return row;
	}

	async function refresh(visitor: Analytics.Visitor, identity: Identity | undefined) {
		const changes = stale(visitor, identity);
		if (!changes) return visitor;
		const [updated] = await SupabaseAPI.update<Analytics.Visitor>(
			`visitors?id=eq.${SupabaseAPI.filter(visitor.id)}`,
			changes,
		);
		return updated ?? visitor;
	}

	export async function visitor(args: {
		anonId: string;
		identity?: Identity | undefined;
	}): Promise<Analytics.Visitor | undefined> {
		const existing =
			(args.identity ? await byAuthId(args.identity.id) : undefined) ??
			(await byAnonId(args.anonId));
		if (existing) return refresh(existing, args.identity);

		try {
			const [created] = await SupabaseAPI.insert<Analytics.Visitor>("visitors", {
				anon_id: args.anonId,
				...profile(args.identity),
			});
			if (created) return created;
		} catch (error) {
			// A parallel request may have inserted the same anon_id first.
			const raced = await byAnonId(args.anonId);
			if (!raced) throw error;
			return refresh(raced, args.identity);
		}
		return byAnonId(args.anonId);
	}

	export async function consent(args: {
		anonId: string;
		granted: boolean;
		categories?: Record<string, boolean>;
		identity?: Identity | undefined;
	}) {
		const row = args.granted
			? await visitor({ anonId: args.anonId, identity: args.identity })
			: undefined;
		await SupabaseAPI.insert("consent_events", {
			visitor_id: row?.id ?? null,
			anon_id: args.anonId,
			granted: args.granted,
			categories: args.categories ?? null,
		});
		return row;
	}

	export async function visit(args: {
		anonId: string;
		input: Analytics.Visit;
		headers: Headers;
		identity?: Identity | undefined;
	}) {
		const row = await visitor({ anonId: args.anonId, identity: args.identity });
		if (!row) return;

		const userAgent = args.headers.get("user-agent");
		const ip = GeoAPI.clientIp(args.headers);
		const place = await GeoAPI.locate(args.headers, ip);
		const agent = Analytics.agent(userAgent);

		await SupabaseAPI.insert("visits", {
			visitor_id: row.id,
			path: args.input.path,
			referrer: args.input.referrer ?? null,
			ip: GeoAPI.isPublic(ip) ? ip : null,
			...place,
			user_agent: userAgent,
			browser: agent.browser,
			os: agent.os,
			device: agent.device,
			language: args.input.language ?? args.headers.get("accept-language")?.split(",")[0] ?? null,
			screen: args.input.screen ?? null,
			utm: args.input.utm && Object.keys(args.input.utm).length > 0 ? args.input.utm : null,
		});
	}

	const VisitColumns = [
		"id",
		"occurred_at",
		"path",
		"referrer",
		"country",
		"region",
		"city",
		"browser",
		"os",
		"device",
		"language",
		"screen",
		"utm",
		"visitor:visitors(id,name,email,avatar_url,is_owner)",
	].join(",");

	export async function dashboard(limit = 100): Promise<Analytics.Dashboard> {
		const [visits, daily, messages, visitCount, visitorCount] = await Promise.all([
			SupabaseAPI.select<Analytics.VisitRow>(
				`visits?select=${VisitColumns}&order=occurred_at.desc&limit=${limit}`,
			),
			SupabaseAPI.select<Analytics.Daily>(
				"visit_daily?select=day,visits,unique_visitors&order=day.desc&limit=30",
			),
			SupabaseAPI.select<Analytics.Message>(
				"contact_messages?select=id,name,email,message,created_at,read_at&order=created_at.desc&limit=50",
			),
			SupabaseAPI.count("visits?select=id"),
			SupabaseAPI.count("visitors?select=id"),
		]);
		return { totals: { visits: visitCount, visitors: visitorCount }, visits, daily, messages };
	}
}
