import { Env } from "../api/env";

/**
 * Minimal PostgREST client for the Supabase project. The secret key bypasses RLS,
 * so it stays on the server: nothing here is reachable from the browser.
 */
export namespace SupabaseAPI {
	export type Values = Record<string, unknown>;

	const Timeout = 8_000;

	export function enabled(): boolean {
		return Boolean(Env.SUPABASE_URL && Env.SUPABASE_SECRET_KEY);
	}

	function url(path: string) {
		const base = (Env.SUPABASE_URL ?? "").replace(/\/+$/, "");
		return `${base}/rest/v1/${path.replace(/^\/+/, "")}`;
	}

	function headers(prefer?: string) {
		const key = Env.SUPABASE_SECRET_KEY ?? "";
		const value: Record<string, string> = {
			apikey: key,
			authorization: `Bearer ${key}`,
			"content-type": "application/json",
		};
		if (prefer) value["prefer"] = prefer;
		return value;
	}

	async function request(path: string, init: RequestInit & { prefer?: string }) {
		if (!enabled()) throw new Error("Supabase is not configured");
		const { prefer, ...rest } = init;
		const response = await fetch(url(path), {
			...rest,
			headers: headers(prefer),
			signal: AbortSignal.timeout(Timeout),
		});
		if (!response.ok) {
			const body = await response.text().catch(() => "");
			throw new Error(
				`Supabase ${rest.method ?? "GET"} ${path} failed (${response.status}) ${body}`,
			);
		}
		return response;
	}

	async function rows<T>(response: Response): Promise<T[]> {
		if (response.status === 204) return [];
		const body: unknown = await response.json().catch(() => null);
		return Array.isArray(body) ? (body as T[]) : [];
	}

	export async function select<T>(path: string): Promise<T[]> {
		return rows<T>(await request(path, { method: "GET" }));
	}

	/** Exact row count via the Content-Range header, without pulling the rows down. */
	export async function count(path: string): Promise<number> {
		const response = await request(path, { method: "HEAD", prefer: "count=exact" });
		const range = response.headers.get("content-range") ?? "";
		const total = Number.parseInt(range.split("/")[1] ?? "", 10);
		return Number.isFinite(total) ? total : 0;
	}

	export async function insert<T>(table: string, values: Values): Promise<T[]> {
		return rows<T>(
			await request(table, {
				method: "POST",
				body: JSON.stringify(values),
				prefer: "return=representation",
			}),
		);
	}

	export async function update<T>(path: string, values: Values): Promise<T[]> {
		return rows<T>(
			await request(path, {
				method: "PATCH",
				body: JSON.stringify(values),
				prefer: "return=representation",
			}),
		);
	}

	export function filter(value: string) {
		return encodeURIComponent(value);
	}
}
