//* Libraries imports
import { defineConfig } from "drizzle-kit";

if(!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  schema: "./src/database/schema.ts",
  out: "./drizzle",
});