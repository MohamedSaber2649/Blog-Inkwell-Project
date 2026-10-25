import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { Pool } from "pg";
process.loadEnvFile();
const PgSession = connectPgSimple(session);
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});
export const Sessions = session({
    store: new PgSession({
        pool: pool,
        tableName: "sessions",
        createTableIfMissing: true
    }),
    name: "blog_session",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production"
    }
})