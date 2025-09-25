import { defineConfig } from '@adonisjs/lucid'

const databaseConfig = defineConfig({
  connection: 'pg',
  connections: {
    pg: {
      client: 'pg',
      connection: {
        host: process.env.PG_HOST,
        port: Number(process.env.PG_PORT),
        user: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
        database: process.env.PG_DB_NAME,
      },
      healthCheck: true,
      migrations: {
        naturalSort: true,
      },
    },
  },
})

export default databaseConfig
