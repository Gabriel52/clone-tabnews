import database from 'infra/database.js';

async function status(_request, response) {
  try {
    const updatedAt = new Date().toISOString();
    const postgresVersion = await database.query('SHOW server_version;');
    const postgresMaxConnections = await database.query('SHOW max_connections;');
    const postgresOpenConnections = 
      await database.query({
        text: "SELECT COUNT(*) FROM pg_stat_activity WHERE datname= $1;",
        values: [process.env.POSTGRES_DB],
      });

    response.status(200).json({
      updated_at: updatedAt,
      dependencies: {
        database: {
          version: postgresVersion[0]?.server_version,
          max_connections: parseInt(postgresMaxConnections[0]?.max_connections, 10),
          opened_connections: parseInt(postgresOpenConnections[0]?.count, 10),
        },
      },
    });

  } catch (err) {
    response.status(500).json({
      error: 'Internal server error',
    });
  }
}

export default status;