import { nanoid } from "nanoid";
import { description, license, name, version } from "../../../../package.json";

export namespace Core {
	export const VERSION = version;
	export const PACKAGE_NAME = name;
	export const PACKAGE_DESCRIPTION = description;
	export const LICENSE = license;

	export const NAME = "Tomo";
	export const DESCRIPTION = "One computer. All your friends on it. And one who lives inside.";

	export const Id = nanoid;

	export const Ports = { Api: 8666, Web: 8667 } as const;

	export type Env = "development" | "production";

	export function isLocal(): boolean {
		const { location } = globalThis as { location?: { hostname: string } };
		return location?.hostname === "localhost";
	}
}
