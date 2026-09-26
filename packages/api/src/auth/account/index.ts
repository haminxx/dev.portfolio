import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { accountsTable } from "./table-sql";

namespace Account {
	export const Table = accountsTable;

	export const Select = createSelectSchema(Table, {
		accessTokenExpiresAt: z.coerce.date().nullable(),
		refreshTokenExpiresAt: z.coerce.date().nullable(),
		createdAt: z.coerce.date(),
		updatedAt: z.coerce.date(),
	});
	export type Select = z.infer<typeof Select>;
}

export { Account };
