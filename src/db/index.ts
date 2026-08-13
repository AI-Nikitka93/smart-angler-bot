import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "../utils/env.js";
import * as schema from "./schema.js";

// Connection for queries
const queryClient = postgres(env.DATABASE_URL);
export const db = drizzle(queryClient, { schema });
