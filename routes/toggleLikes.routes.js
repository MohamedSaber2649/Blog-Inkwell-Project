import { Router } from "express";
import { checkAuth } from "../middleware/checkAuth.js";
import { postQueries } from "../queries/post.queries.js";
const toggle = postQueries();
export const toggleRoute = Router();
toggleRoute.post("/:id/like", checkAuth, async (req, res) => {
    // get the id of user from user
    const { id: userId } = req.user
    // get the id from params
    const { id } = req.params
    const existing = await toggle.getPostData(id, userId);
    if (!existing) {
        return res.status(404).json({
            error: "post not found"
        })
    }
    const result = await toggle.toggleLike(id, userId);
    return res.status(200).json({ data: result })
})