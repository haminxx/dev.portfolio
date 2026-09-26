import { Db } from "../../api/db";
import { User } from "../user";

export const sessionsTable = Db.Table(
	"session",
	{
		id: Db.Text("id").primaryKey(),
		userId: Db.Text("user_id")
			.notNull()
			.references(() => User.Table.id, { onDelete: "cascade" }),
		token: Db.Text("token").notNull().unique(),
		expiresAt: Db.Timestamp("expires_at").notNull(),
		ipAddress: Db.Text("ip_address"),
		userAgent: Db.Text("user_agent"),
		createdAt: Db.Timestamp("created_at").notNull(),
		updatedAt: Db.Timestamp("updated_at").notNull(),
	},
	(table) => [Db.Index("session_user_id_idx").on(table.userId)],
);
