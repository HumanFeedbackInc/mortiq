import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';
import { drizzle } from 'drizzle-orm/node-postgres';
config({ path: '.env' });

export default defineConfig({
  schema: './drizzle/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DIRECT_DATABASE_URL!,
  },
});
