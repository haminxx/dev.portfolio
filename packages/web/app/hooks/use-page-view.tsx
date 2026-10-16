import type { Analytics } from "@tomo/api";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { hono } from "~/lib/hono";
import { useConsent } from "./use-consent";

const Campaign = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "ref"];

function campaign(search: string) {
	const params = new URLSearchParams(search);
	const utm: Record<string, string> = {};
	for (const key of Campaign) {
		const value = params.get(key);
		if (value) utm[key] = value.slice(0, 256);
	}
	return utm;
}

/** Records a page view, but only once consent has been granted. */
export function usePageView() {
	const { consent } = useConsent();
	const location = useLocation();
	const last = useRef<string | null>(null);

	useEffect(() => {
		if (consent !== "granted") return;
		const path = `${location.pathname}${location.search}`;
		if (last.current === path) return;
		last.current = path;

		const utm = campaign(location.search);
		const json: Analytics.Visit = {
			path,
			...(document.referrer ? { referrer: document.referrer.slice(0, 2048) } : {}),
			...(navigator.language ? { language: navigator.language } : {}),
			...(window.screen ? { screen: `${window.screen.width}x${window.screen.height}` } : {}),
			...(Object.keys(utm).length > 0 ? { utm } : {}),
		};

		void hono.api.analytics.visit.$post({ json }).catch(() => undefined);
	}, [consent, location.pathname, location.search]);
}
