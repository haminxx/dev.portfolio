import { Db } from "../../api/db";
import { User } from "../user";

export const accountsTable = Db.Table(
	"account",
	{
		id: Db.Text("id").primaryKey(),
		userId: Db.Text("user_id")
			.notNull()
			.references(() => User.Table.id, { onDelete: "cascade" }),
		accountId: Db.Text("account_id").notNull(),
		providerId: Db.Text("provider_id").notNull(),
		accessToken: Db.Text("access_token"),
		refreshToken: Db.Text("refresh_token"),
		accessTokenExpiresAt: Db.Timestamp("access_token_expires_at"),
		refreshTokenExpiresAt: Db.Timestamp("refresh_token_expires_at"),
		scope: Db.Text("scope"),
		idToken: Db.Text("id_token"),
		password: Db.Text("password"),
		createdAt: Db.Timestamp("created_at").notNull(),
		updatedAt: Db.Timestamp("updated_at").notNull(),
	},
	(table) => [Db.Index("account_user_id_idx").on(table.userId)],
);
