import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import "dotenv/config";

const dbConnection = process.env.DB_CONNECTION!;

// for migrations
export const migrationClient = postgres(dbConnection, {
  max: 1,
  ssl: "require",
});

// for query purposes
const queryClient = postgres(dbConnection, {
  ssl: "require",
});
export const db: PostgresJsDatabase = drizzle(queryClient);
