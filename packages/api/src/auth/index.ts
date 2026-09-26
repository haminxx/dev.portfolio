import type { AuthAPI } from "./api";

namespace Auth {
	export type Type = ReturnType<typeof AuthAPI.create>;
	export type Session = Type["$Infer"]["Session"]["session"];
	export type User = Type["$Infer"]["Session"]["user"];

	export type Identity = {
		session: Session;
		user: User;
	};
}

export type { Auth };
