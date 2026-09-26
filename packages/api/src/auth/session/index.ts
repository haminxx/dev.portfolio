import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { sessionsTable } from "./table-sql";

namespace Session {
	export const Table = sessionsTable;

	export const Select = createSelectSchema(Table, {
		expiresAt: z.coerce.date(),
		createdAt: z.coerce.date(),
		updatedAt: z.coerce.date(),
	});
	export type Select = z.infer<typeof Select>;
}

export { Session };
