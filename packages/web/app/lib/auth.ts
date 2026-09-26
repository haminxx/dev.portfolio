import { Api, Core } from "@tomo/api";
import { createAuthClient } from "better-auth/react";

export const { signIn, signUp, signOut, useSession } = createAuthClient({
	baseURL: Core.isLocal() ? Api.URLs.Domains.Development : Api.URLs.Domains.Production,
	basePath: "/api/auth",
	sessionOptions: { refetchOnWindowFocus: false },
});
