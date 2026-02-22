import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database.js";

export default async function migrations(request, response) {
  const dbClient = await database.getNewClient();

  const defaultMigrationsConfig = {
    dbClient,
    dir: join("infra", "migrations"),
    direction: "up",
    migrationsTable: "pgmigrations",
    verbose: true,
    dryRun: true,
  };

  if (request.method === "POST") {
    const pendingMigrations = await migrationRunner({
      ...defaultMigrationsConfig,
      dryRun: false,
    });

    await dbClient.end();

    if (pendingMigrations.length > 0) {
      return response.status(201).json(pendingMigrations);
    }

    return response.status(200).json(pendingMigrations);
  }

  if (request.method === "GET") {
    const migratedMigrations = await migrationRunner({
      ...defaultMigrationsConfig,
    });

    await dbClient.end();

    return response.status(200).json(migratedMigrations);
  }

  response.status(405).json({ error: "Method not allowed" });
}
