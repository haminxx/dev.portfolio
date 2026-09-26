import type { Core } from ".";

export namespace CoreAPI {
	export function env(): Core.Env {
		return process.env["ENVIRONMENT"] === "production" ? "production" : "development";
	}

	export function isLocal(): boolean {
		return env() === "development";
	}

	export function isProduction(): boolean {
		return env() === "production";
	}
}
