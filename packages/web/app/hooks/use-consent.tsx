import { Analytics } from "@tomo/api";
import { useCallback, useEffect, useSyncExternalStore } from "react";
import { hono } from "~/lib/hono";

export type ConsentState = "granted" | "denied" | "unknown";

function read(): ConsentState {
	if (typeof document === "undefined") return "unknown";
	const entry = document.cookie
		.split("; ")
		.find((cookie) => cookie.startsWith(`${Analytics.ConsentCookie}=`));
	const value = entry?.slice(Analytics.ConsentCookie.length + 1);
	if (value === "granted") return "granted";
	if (value === "denied") return "denied";
	return "unknown";
}

let state: ConsentState = read();
const listeners = new Set<() => void>();

function emit(next: ConsentState) {
	if (next === state) return;
	state = next;
	for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
}

/**
 * The server owns the consent cookie; this mirrors it so the banner and the
 * page-view tracker agree without either of them guessing.
 */
export function useConsent() {
	const consent = useSyncExternalStore(
		subscribe,
		() => state,
		() => "unknown" as ConsentState,
	);

	useEffect(() => {
		emit(read());
	}, []);

	const decide = useCallback(async (granted: boolean) => {
		const response = await hono.api.analytics.consent.$post({
			json: { granted, categories: { analytics: granted } },
		});
		if (!response.ok) throw new Error("Failed to save your choice");
		emit(read());
	}, []);

	return { consent, decide };
}
