export namespace Owner {
	export const Name = "Christian Lee";
	export const Email = "christianjameslee1@gmail.com";

	export function normalize(email: string) {
		return email.trim().toLowerCase();
	}
}
