import { Db } from "../../api/db";

export const verificationsTable = Db.Table(
	"verification",
	{
		id: Db.Text("id").primaryKey(),
		identifier: Db.Text("identifier").notNull(),
		value: Db.Text("value").notNull(),
		expiresAt: Db.Timestamp("expires_at").notNull(),
		createdAt: Db.Timestamp("created_at").notNull(),
		updatedAt: Db.Timestamp("updated_at").notNull(),
	},
	(table) => [Db.Index("verification_identifier_idx").on(table.identifier)],
);
