import z from "zod"
export function checkSchema(schema) {
    return (req, res, next) => {
        // get the data from body
        const data = req.body
        // parsing the schema
        const result = schema.safeParse(data);
        // check Schema
        if (!result.success) {
            return res.status(422).json({ errors: z.treeifyError(result.error).properties })
        }
        req.body = result.data
        next();
    }
}