import { useQuery } from "@tanstack/react-query";
import { Analytics } from "@tomo/api";
import { errorMessage, hono } from "~/lib/hono";

/** Owner-only: whether this session's email is in OWNER_EMAILS, decided server-side. */
export function useAnalyticsAccess() {
	return useQuery({
		queryKey: ["analytics", "me"],
		staleTime: 30_000,
		queryFn: async () => {
			const response = await hono.api.analytics.me.$get();
			if (!response.ok) throw new Error(await errorMessage(response));
			return response.json();
		},
	});
}

/** Polls instead of opening Supabase Realtime in the browser: the key stays on the server. */
export function useAnalyticsDashboard(enabled: boolean) {
	return useQuery({
		queryKey: ["analytics", "dashboard"],
		enabled,
		refetchInterval: Analytics.PollInterval,
		refetchOnWindowFocus: true,
		queryFn: async () => {
			const response = await hono.api.analytics.dashboard.$get();
			if (!response.ok) throw new Error(await errorMessage(response));
			return response.json();
		},
	});
}
