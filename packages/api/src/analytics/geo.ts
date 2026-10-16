import type { Analytics } from ".";

/**
 * Approximate location for a visit. Cloudflare's headers are free and instant when the
 * site sits behind it; otherwise we ask a free, keyless IP lookup and give up quietly.
 */
export namespace GeoAPI {
	const Empty: Analytics.Place = {
		country: null,
		region: null,
		city: null,
		latitude: null,
		longitude: null,
		timezone: null,
	};

	const Timeout = 2_500;
	const Ttl = 24 * 60 * 60 * 1000;
	const MaxEntries = 500;
	const cache = new Map<string, { at: number; place: Analytics.Place }>();

	function text(value: string | null | undefined) {
		const trimmed = (value ?? "").trim();
		return trimmed.length > 0 && trimmed.toUpperCase() !== "XX" ? trimmed : null;
	}

	function number(value: unknown) {
		const parsed = typeof value === "number" ? value : Number.parseFloat(String(value ?? ""));
		return Number.isFinite(parsed) ? parsed : null;
	}

	function empty(place: Analytics.Place) {
		return Object.values(place).every((value) => value === null);
	}

	export function fromHeaders(headers: Headers): Analytics.Place {
		return {
			country: text(headers.get("cf-ipcountry")),
			region: text(headers.get("cf-region")) ?? text(headers.get("cf-region-code")),
			city: text(headers.get("cf-ipcity")),
			latitude: number(headers.get("cf-iplatitude")),
			longitude: number(headers.get("cf-iplongitude")),
			timezone: text(headers.get("cf-timezone")),
		};
	}

	export function isPublic(ip: string | null): ip is string {
		if (!ip) return false;
		if (ip === "::1" || ip.startsWith("127.") || ip.startsWith("fe80:") || ip.startsWith("fc")) {
			return false;
		}
		if (ip.startsWith("10.") || ip.startsWith("192.168.")) return false;
		const second = Number.parseInt(ip.split(".")[1] ?? "", 10);
		if (ip.startsWith("172.") && second >= 16 && second <= 31) return false;
		return true;
	}

	async function fetchJson(url: string): Promise<Record<string, unknown> | null> {
		try {
			const response = await fetch(url, {
				headers: { accept: "application/json" },
				signal: AbortSignal.timeout(Timeout),
			});
			if (!response.ok) return null;
			const body: unknown = await response.json();
			return body && typeof body === "object" ? (body as Record<string, unknown>) : null;
		} catch {
			return null;
		}
	}

	async function lookupIpapi(ip: string): Promise<Analytics.Place | null> {
		const body = await fetchJson(`https://ipapi.co/${encodeURIComponent(ip)}/json/`);
		if (!body || body["error"]) return null;
		return {
			country: text(body["country_code"] as string),
			region: text(body["region"] as string),
			city: text(body["city"] as string),
			latitude: number(body["latitude"]),
			longitude: number(body["longitude"]),
			timezone: text(body["timezone"] as string),
		};
	}

	async function lookupIpApiCom(ip: string): Promise<Analytics.Place | null> {
		const fields = "status,countryCode,regionName,city,lat,lon,timezone";
		const body = await fetchJson(
			`http://ip-api.com/json/${encodeURIComponent(ip)}?fields=${fields}`,
		);
		if (body?.["status"] !== "success") return null;
		return {
			country: text(body["countryCode"] as string),
			region: text(body["regionName"] as string),
			city: text(body["city"] as string),
			latitude: number(body["lat"]),
			longitude: number(body["lon"]),
			timezone: text(body["timezone"] as string),
		};
	}

	export async function locate(headers: Headers, ip: string | null): Promise<Analytics.Place> {
		const edge = fromHeaders(headers);
		if (!empty(edge)) return edge;
		if (!isPublic(ip)) return Empty;

		const hit = cache.get(ip);
		if (hit && Date.now() - hit.at < Ttl) return hit.place;

		const place = (await lookupIpapi(ip)) ?? (await lookupIpApiCom(ip)) ?? Empty;
		if (cache.size >= MaxEntries) cache.clear();
		cache.set(ip, { at: Date.now(), place });
		return place;
	}

	export function clientIp(headers: Headers): string | null {
		const forwarded = headers.get("cf-connecting-ip") ?? headers.get("x-real-ip") ?? "";
		if (forwarded.trim()) return forwarded.trim();
		const chain = headers.get("x-forwarded-for") ?? "";
		const first = chain.split(",")[0]?.trim();
		return first && first.length > 0 ? first : null;
	}
}
