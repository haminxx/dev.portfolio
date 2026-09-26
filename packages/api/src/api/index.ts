import type { AppType } from "./routes";

export namespace Api {
	export type App = AppType;

	export const URLs = {
		Domains: {
			Production: "https://tomo.computer",
			Development: "http://localhost:8667",
		},
	};
}
