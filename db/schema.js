import { defineRelations } from "drizzle-orm";
import { pgTable, integer, primaryKey, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    username: varchar("username", { length: 150 }).notNull(),
    email: varchar("email", { length: 150 }).unique().notNull(),
    password: varchar("password", { length: 500 }).notNull(),
    created_at: timestamp("created_at").defaultNow()
})
export const posts = pgTable("posts", {
    id: serial("id").primaryKey(),
    content: text("content"),
    created_at: timestamp("created_at").defaultNow(),
    image: varchar("image", { length: 300 }),
    userId: integer("user_id").notNull().references(() => users.id),
})
export const comments = pgTable("comments", {
    id: serial("id").primaryKey(),
    content: text("content"),
    created_at: timestamp("created_at").defaultNow(),
    userId: integer("user_id").notNull().references(() => users.id),
    postId: integer("post_id").notNull().references(() => posts.id)
})
export const likes = pgTable("likes", {
    userId: integer("user_id").notNull().references(() => users.id),
    postId: integer("post_id").notNull().references(() => posts.id),
    created_at: timestamp("created_at").defaultNow()
}, (table) =>
    [primaryKey({ columns: [table.userId, table.postId] })]
)
export const relations = defineRelations({ users, likes, comments, posts }, (r) => ({
    users: {
        post: r.many.posts({
            from: r.users.id,
            to: r.posts.userId
        }),
        like: r.many.likes({
            from: r.users.id,
            to: r.likes.userId
        }),
        comments: r.many.comments({
            from: r.users.id,
            to: r.comments.userId
        })
    },
    posts: {
        user: r.one.users(),
        likes: r.many.likes({
            from: r.posts.id,
            to: r.likes.postId
        }),
        comments: r.many.comments({
            from: r.posts.id,
            to: r.comments.postId
        })
    },
    likes: {
        user: r.one.users(),
        posts: r.one.posts()
    },
    comments: {
        user: r.one.users(),
        posts: r.one.posts()
    }
}))
