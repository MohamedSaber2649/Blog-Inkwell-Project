import bcrypt from "bcrypt";
import { reset, seed } from "drizzle-seed";
import { db } from "./db/index.js";
import * as schema from "./db/schema.js";
const passwordHash = await bcrypt.hash("Password1!", 10);
await reset(db, schema);
await seed(db, { users: schema.users, posts: schema.posts, comments: schema.comments }, { seed: 1 })
    .refine((f) => ({
        users: {
            count: 5,
            columns: {
                username: f.firstName(),
                email: f.email(),
                password: f.valuesFromArray({ values: [passwordHash] }),
            },
        },
        posts: {
            count: 10,
            columns: {
                content: f.loremIpsum({ sentencesCount: 2 }),
                image: f.valuesFromArray({ values: [null] }),
            },
        },
        comments: {
            count: 20,
            columns: {
                content: f.loremIpsum({ sentencesCount: 1 }),
            },
        },
    }));
const allUsers = await db.select({ id: schema.users.id }).from(schema.users);
const allPosts = await db.select({ id: schema.posts.id }).from(schema.posts);
const pairs = new Set();
while (pairs.size < 15) {
    const userId = allUsers[Math.floor(Math.random() * allUsers.length)].id;
    const postId = allPosts[Math.floor(Math.random() * allPosts.length)].id;
    pairs.add(`${userId}-${postId}`);
}
await db.insert(schema.likes).values(
    [...pairs].map((s) => {
        const [userId, postId] = s.split("-").map(Number);
        return { userId, postId };
    })
);
console.log("seeding data successfully");
