import z from "zod"
export const authSchemaRegister = z.object({
    username: z.string().min(2, "must be at least 2 characters"),
    email: z.email(),
    password: z.string().regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/, "must have uppercase, lowercase, digit, special char"),
    password_confirmation: z.string().regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/, "must have uppercase, lowercase, digit, special char"),
}).refine(data => data.password === data.password_confirmation, {
    error: "password and password_confirmation must be match",
    path: ["password_confirmation"]
})
export const authSchemaLogin = z.object({
    email: z.email(),
    password: z.string().min(8, "must be at least 8 characters")
})
