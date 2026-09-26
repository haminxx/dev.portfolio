import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate as runMigrations } from "drizzle-orm/better-sqlite3/migrator";
import { Env } from "../env";

export namespace DbAPI {
	export const MigrationsFolder = "src/api/db/migrations";

	export function connect(file = Env.DATABASE_PATH) {
		mkdirSync(dirname(file), { recursive: true });
		const sqlite = new Database(file);
		sqlite.pragma("journal_mode = WAL");
		sqlite.pragma("synchronous = NORMAL");
		sqlite.pragma("busy_timeout = 5000");
		sqlite.pragma("foreign_keys = ON");
		return drizzle({ client: sqlite });
	}

	let cached: ReturnType<typeof connect> | undefined;

	export function instance() {
		cached ??= connect();
		return cached;
	}

	export function migrate(db: ReturnType<typeof connect>, migrationsFolder = MigrationsFolder) {
		runMigrations(db, { migrationsFolder });
	}
}
