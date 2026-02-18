import migrationRunner from "node-pg-migrate";
import { join } from "node:path";

export default async function migrations(request, response) {
  if (request.method === "POST") {
    const migrations = await migrationRunner({
      databaseUrl: process.env.DATABASE_URL,
      dir: join("infra", "migrations"),
      direction: "up",
      migrationsTable: "pgmigrations",
      dryRun: true,
      verbose: true,
    });

    response.status(200).json(migrations);
  }

  if (request.method === "GET") {
    const migrations = await migrationRunner({
      databaseUrl: process.env.DATABASE_URL,
      dir: join("infra", "migrations"),
      direction: "up",
      migrationsTable: "pgmigrations",
      dryRun: true,
      verbose: true,
    });

    response.status(200).json(migrations);
  }

  response.status(405).json({ error: "Method not allowed" });
}
