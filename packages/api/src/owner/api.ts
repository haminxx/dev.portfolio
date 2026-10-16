import { Env } from "../api/env";
import { Owner } from ".";

export namespace OwnerAPI {
	/** Fallback for OWNER_EMAILS. Server-side only: it never reaches the browser bundle. */
	const Fallback = [Owner.Email, "wildkid123456@gmail.com"];

	export function emails(): string[] {
		const configured = (Env.OWNER_EMAILS ?? "")
			.split(",")
			.map(Owner.normalize)
			.filter((email) => email.length > 0);
		return configured.length > 0 ? configured : Fallback.map(Owner.normalize);
	}

	export function is(email: string | null | undefined): boolean {
		if (!email) return false;
		return emails().includes(Owner.normalize(email));
	}
}
