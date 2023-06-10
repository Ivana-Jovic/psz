import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema/**",
  out: "./drizzle",
  connectionString: process.env.DB_CONNECTION,
} satisfies Config;
