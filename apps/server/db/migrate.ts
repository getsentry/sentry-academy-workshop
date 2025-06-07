// @ts-nocheck
import { drizzle } from 'drizzle-orm/postgres-js';
import { drizzle as drizzleSqlite } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { migrate as migrateSqlite } from 'drizzle-orm/better-sqlite3/migrator';
import postgres from 'postgres';
import Database from 'better-sqlite3';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const runMigrations = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set in .env file');
  }
  
  const connectionString = process.env.DATABASE_URL;
  const isSqlite = connectionString.startsWith('sqlite:');

  console.log('Running migrations...');
  
  try {
    if (isSqlite) {
      // SQLite migration
      const dbPath = connectionString.replace('sqlite:', '');
      const sqlite = new Database(dbPath);
      const db = drizzleSqlite(sqlite);
      
      await migrateSqlite(db, { migrationsFolder: './drizzle' });
      sqlite.close();
    } else {
      // PostgreSQL migration
      const sql = postgres(connectionString, { max: 1 });
      const db = drizzle(sql);
      
      await migrate(db, { migrationsFolder: './drizzle' });
      await sql.end();
    }
    
    console.log('Migrations completed!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
  
  process.exit(0);
};

runMigrations().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});