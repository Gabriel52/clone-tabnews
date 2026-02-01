import { Client } from 'pg';


async function query(queryObject) {

  console.log(process.env.POSTGRES_DATABASE)
  const client  = await new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
  })
  await client.connect()

  const result = await client.query(queryObject)
  await client.end()

  return result?.rows
}


export default {
  query: query,
};