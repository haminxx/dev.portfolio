import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { verificationsTable } from "./table-sql";

namespace Verification {
	export const Table = verificationsTable;

	export const Select = createSelectSchema(Table, {
		expiresAt: z.coerce.date(),
		createdAt: z.coerce.date(),
		updatedAt: z.coerce.date(),
	});
	export type Select = z.infer<typeof Select>;
}

export { Verification };
