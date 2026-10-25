import { eq } from "drizzle-orm"
import { db } from "../db/index.js"
import { comments, posts, users } from "../db/schema.js"
export function commentQueries() {
    async function createComment( postId, userId, content ) {
        const post = await db
            .select({ id: posts.id })
            .from(posts)
            .where(eq(posts.id, postId));
        const result = await db
            .insert(comments)
            .values({
                postId,
                userId,
                content
            })
            .returning({
                id: comments.id,
                content: comments.content,
                created_at: comments.created_at
            });
        const [user] = await db
            .select({ username: users.username })
            .from(users)
            .where(eq(users.id, userId));
        return {
            ...result[0],
            username: user.username
        };
    }
    return { createComment }
}