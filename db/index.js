import { drizzle } from "drizzle-orm/node-postgres";
import { relations } from "./schema.js";
process.loadEnvFile();
export const db = drizzle({
    connection: process.env.DATABASE_URL,
    relations,
});
// import { drizzle } from "drizzle-orm/node-postgres";
// import * as schema from "./schema.js";
// import { Pool } from "pg";
// process.loadEnvFile();
// const pool = new Pool({
//     connectionString: process.env.DATABASE_URL
// })
// export const db = drizzle(pool, { schema })
