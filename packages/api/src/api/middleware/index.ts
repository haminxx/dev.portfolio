import type { Auth } from "../../auth";

export namespace Middleware {
	export type IsAuthenticated = { Variables: { identity: Auth.Identity } };
}
