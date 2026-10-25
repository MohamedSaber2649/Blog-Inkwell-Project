import z from "zod"
export const postSchema = z.object({
    content: z.string().trim().min(3, "must be at least 3 charcter").max(5000),
    image: z.string().optional().default(null)
})