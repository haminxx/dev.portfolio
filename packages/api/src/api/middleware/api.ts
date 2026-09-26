import { isAuthenticated as isAuthenticatedMiddleware } from "./is-authenticated";

export namespace MiddlewareAPI {
	export const isAuthenticated = isAuthenticatedMiddleware;
}
