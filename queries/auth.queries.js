import { eq } from "drizzle-orm"
import { db } from "../db/index.js"
import { users } from "../db/schema.js"
export function authQueries() {
    async function getAll() {
        const result = await db.select()
            .from(users)
        return result
    }
    async function getById(id) {
        const result = await db.select()
            .from(users)
            .where(eq(users.id, id))
        return result[0];
    }
    async function getByEmail(email) {
        const result = await db.select()
            .from(users)
            .where(eq(users.email, email))
        return result[0];
    }
    async function create(username, email, password) {
        const result = await db.insert(users).values({
            username: username,
            email: email,
            password: password
        })
    }
    return { getAll, getById, getByEmail, create }
}