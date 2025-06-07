import type { Config } from 'drizzle-kit';

const databaseUrl = process.env.DATABASE_URL!;
const isSqlite = databaseUrl.startsWith('sqlite:');

export default {
  schema: './db/schema.ts',
  out: './drizzle',
  dialect: isSqlite ? 'sqlite' : 'postgresql',
  dbCredentials: isSqlite 
    ? { url: databaseUrl.replace('sqlite:', '') }
    : { url: databaseUrl },
} satisfies Config;