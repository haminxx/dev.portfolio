import { defineConfig } from "drizzle-kit";
import { Env } from "./src/api/env";

export default defineConfig({
	schema: "./src/**/*-sql.ts",
	out: "./src/api/db/migrations",
	migrations: { prefix: "timestamp" },
	dialect: "sqlite",
	dbCredentials: { url: Env.DATABASE_PATH },
});
