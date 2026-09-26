import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { usersTable } from "./table-sql";

export namespace User {
	export const Table = usersTable;

	export const Select = createSelectSchema(Table, {
		createdAt: z.coerce.date(),
		updatedAt: z.coerce.date(),
	});
	export type Select = z.infer<typeof Select>;

	export function firstName(user: { name?: string | null | undefined }) {
		return user.name?.trim().split(/\s+/)[0] ?? "";
	}
}
