import { Db } from "../../api/db";

export const usersTable = Db.Table("user", {
	id: Db.Text("id").primaryKey(),
	name: Db.Text("name").notNull(),
	email: Db.Text("email").notNull().unique(),
	emailVerified: Db.Bool("email_verified").notNull().default(false),
	image: Db.Text("image"),
	createdAt: Db.Timestamp("created_at").notNull(),
	updatedAt: Db.Timestamp("updated_at").notNull(),
});
