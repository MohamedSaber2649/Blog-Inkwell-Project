import { count, desc, eq, sql, and } from "drizzle-orm"
import { db } from "../db/index.js"
import { comments, likes, posts, users } from "../db/schema.js"
export function postQueries() {
    async function getAllPosts(userId) {
        const result = await db.select({
            id: posts.id,
            content: posts.content,
            image: posts.image,
            created_at: posts.created_at,
            username: users.username,
            // subquery to get the total of likes
            like_count: sql`(
                SELECT COUNT(*)
                FROM ${likes}
                WHERE ${likes.postId} = ${posts.id}
                )`.mapWith(Number),
            // subquery to get the total of comment
            comment_count: sql`(
            SELECT COUNT(*)
            FROM ${comments}
            WHERE ${comments.postId} = ${posts.id}
            )`.mapWith(Number),
            // exists return true if condition is true
            liked_by_me: sql`EXISTS(
            SELECT 1 FROM ${likes}
            WHERE ${likes.postId} = ${posts.id}
            AND ${likes.userId} = ${userId})`.mapWith(Boolean)
        })
            .from(posts).innerJoin(users, eq(users.id, posts.userId)).orderBy(desc(posts.created_at));
        return result;
    }
    async function createPost({content, image, userId}) {
        const result = await db.insert(posts).values({
            content: content,
            image: image,
            userId: userId
        })
        return result[0];
    }
    async function getPostData(id, userId) {
        const result = await db
            .select({
                id: posts.id,
                content: posts.content,
                image: posts.image,
                created_at: posts.created_at,
                username: users.username,
                like_count: sql`count(distinct ${likes.userId})`.mapWith(Number),
                comment_count: sql`count(distinct ${comments.userId})`.mapWith(Number),
                liked_by_me: sql`EXISTS (
                SELECT 1
                FROM ${likes}
                WHERE ${likes.postId} = ${posts.id}
                AND ${likes.userId} = ${userId}
            )`.mapWith(Boolean)
            })
            .from(posts)
            .innerJoin(users, eq(users.id, posts.userId))
            // if posts have or not have comments and likes will display this post
            .leftJoin(likes, eq(likes.postId, posts.id))
            .leftJoin(comments, eq(comments.postId, posts.id))
            .where(eq(posts.id, id))
            .groupBy(posts.id, users.id);
        return result[0];
    }
    async function getPostComments(postId) {
        return await db
            .select({
                id: comments.id,
                content: comments.content,
                created_at: comments.created_at,
                username: users.username
            })
            .from(comments)
            .innerJoin(users, eq(users.id, comments.userId))
            .where(eq(comments.postId, postId))
            .orderBy(desc(comments.created_at));
    }
    async function getPostById(id, userId) {
        const post = await getPostData(id, userId);
        const postComments = await getPostComments(id);
        return {
            post,
            comments: postComments
        };
    }
    async function toggleLike(postId, userId) {
        const post = await db
            //  select the post id from table posts
            .select({ id: posts.id })
            .from(posts)
            .where(eq(posts.id, postId));
        // check if exisit or not
        if (!post.length) {
            return null;
        }
        // get the if exist from table likes
        const existingLike = await db
            .select()
            .from(likes)
            .where(
                and(
                    eq(likes.postId, postId),
                    eq(likes.userId, userId)
                )
            );
        let liked;  // flag variable
        if (existingLike.length) {
            await db
                .delete(likes)
                .where(
                    and(
                        eq(likes.postId, postId),
                        eq(likes.userId, userId)
                    )
                );
            liked = false;
        } else {
            await db.insert(likes).values({
                postId,
                userId
            });
            liked = true;
        }
        const [likeCount] = await db
            .select({ count: count() })
            .from(likes)
            .where(eq(likes.postId, postId));
        return {
            liked,
            like_count: likeCount.count
        };
    }
    return { getAllPosts, createPost, getPostById, getPostData, toggleLike }
}