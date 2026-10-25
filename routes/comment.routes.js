import { Router } from "express";
import { checkAuth } from "../middleware/checkAuth.js";
import { commentQueries } from "../queries/comment.queries.js";
import { commentSchema } from "../validation-schemas/comment.js";
import { checkSchema } from "../middleware/validateBody.js";
import { postQueries } from "../queries/post.queries.js";
const post = postQueries()
const queries = commentQueries();
export const commentRoute = Router();
commentRoute.post("/:id/comments", checkAuth, checkSchema(commentSchema), async (req, res) => {
    //get the id from requst user
    const { id: userId } = req.user;
    //get the PostId from params
    const { id } = req.params;
    // get the content from body
    const { content } = req.body
    const existing = await post.getPostData(id, userId)
    if (!existing) {
        return res.status(404).json({
            error: "post not found"
        })
    }
    // create new comment
    const result = await queries.createComment(id, userId, content);
    return res.status(201).json({
        "message": "comment created successfully",
        data: result
    })
})