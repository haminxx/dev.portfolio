import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate as runMigrations } from "drizzle-orm/better-sqlite3/migrator";
import { CoreAPI } from "../../core/api";

export namespace DbAPI {
	export function path(): string {
		const configured = process.env["DATABASE_PATH"];
		if (configured) return configured;
		if (CoreAPI.isProduction()) throw new Error("DATABASE_PATH must be set in production");
		return fileURLToPath(new URL("../../../../../.tomo/tomo.db", import.meta.url));
	}

	export function connect(file = path()) {
		mkdirSync(dirname(file), { recursive: true });
		const sqlite = new Database(file);
		sqlite.pragma("journal_mode = WAL");
		sqlite.pragma("synchronous = NORMAL");
		sqlite.pragma("busy_timeout = 5000");
		sqlite.pragma("foreign_keys = ON");
		return drizzle({ client: sqlite });
	}

	export function migrate(db: ReturnType<typeof connect>, migrationsFolder: string) {
		runMigrations(db, { migrationsFolder });
	}
}
