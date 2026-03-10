import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database.js";

const allowedMethods = ["POST", "GET"];

export default async function migrations(request, response) {
  if (!allowedMethods.includes(request.method)) {
    return response
      .status(405)
      .json({ error: `${request.method} method not allowed` });
  }

  try {
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

      if (pendingMigrations.length > 0) {
        return response.status(201).json(pendingMigrations);
      }

      return response.status(200).json(pendingMigrations);
    }

    if (request.method === "GET") {
      const migratedMigrations = await migrationRunner({
        ...defaultMigrationsConfig,
      });

      return response.status(200).json(migratedMigrations);
    }
  } catch (error) {
    return response.status(500).json({ error: error.message });
  } finally {
    await dbClient.end();
  }
}
