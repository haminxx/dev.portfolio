export namespace Owner {
	export const Name = "Christian Lee";
	export const Email = "christianjameslee1@gmail.com";

	/** Fallback for OWNER_EMAILS. Anyone signed in with one of these runs the site. */
	export const Emails = [Email, "wildkid123456@gmail.com"] as const;

	export function normalize(email: string) {
		return email.trim().toLowerCase();
	}
}
