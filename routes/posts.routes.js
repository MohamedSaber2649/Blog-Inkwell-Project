import { Router } from "express";
import { checkAuth } from "../middleware/checkAuth.js";
import { postQueries } from "../queries/post.queries.js";
import { upload } from "../middleware/upload.js";
import { postSchema } from "../validation-schemas/posts.js";
import { checkSchema } from "../middleware/validateBody.js";
const queries = postQueries();
export const postsRoute = Router();
postsRoute.route("/posts")
    .get(checkAuth, async (req, res) => {
        // get the id of user from req.user
        const { id } = req.user
        // get all posts from db
        const allPosts = await queries.getAllPosts(id);
        return res.status(200).json({
            data: allPosts
        })
    }).post(checkAuth,
        upload.single("image"),
        checkSchema(postSchema),
        async (req, res) => {
            // get the id from req.user
            const { id: userId } = req.user;
            // get the data from body
            const { content } = req.body
            // insert data in database
            const result = await queries.createPost({
                content,
                // if exist image take the file name else null
                image: req.file?.filename ?? null,
                userId: userId
            })
            return res.status(201).json({
                message: "post created successfully",
                data: result
            })
        })
postsRoute.route("/posts/:id")
    .get(checkAuth, async (req, res) => {
        // get the id from user id
        const { id: userId } = req.user
        // get the id from params
        const { id } = req.params;
        // check if post found or not
        const data = await queries.getPostData(id, userId);
        if (!data) {
            return res.status(404).json({
                error: "post not found"
            })
        }
        const result = await queries.getPostById(id, userId);
        return res.status(200).json({
            data: result
        })
    })

