import { drizzle } from 'drizzle-orm/node-postgres';
import { drizzle as drizzleSqlite } from 'drizzle-orm/better-sqlite3';
import { Pool } from 'pg';
import Database from 'better-sqlite3';
import * as dotenv from 'dotenv';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;
const isSqlite = databaseUrl?.startsWith('sqlite:');

let db, pool;

if (isSqlite) {
  // SQLite configuration
  const dbPath = databaseUrl.replace('sqlite:', '');
  const sqlite = new Database(dbPath);
  db = drizzleSqlite(sqlite);
  console.log('Using SQLite database:', dbPath);
} else {
  // PostgreSQL configuration
  pool = new Pool({
    connectionString: databaseUrl,
  });

  db = drizzle(pool);

  // Event listeners for pool
  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
  });

  pool.on('connect', () => {
    console.log('Connected to PostgreSQL database');
  });

  // Shutdown handler
  process.on('SIGINT', () => {
    pool.end().then(() => {
      console.log('Pool has ended');
      process.exit(0);
    });
  });
}

export { db };
export default pool;
