import { Router } from "express";
import { checkSchema } from "../middleware/validateBody.js";
import { authSchemaRegister, authSchemaLogin } from "../validation-schemas/auth.js";
import { authQueries } from "../queries/auth.queries.js";
import bcrypt from "bcrypt"
import { checkAuth } from "../middleware/checkAuth.js";
export const authRoute = Router();
const queries = authQueries();
authRoute.post("/register", checkSchema(authSchemaRegister), async (req, res) => {
    // get all data from body
    const { username, email, password } = req.body;
    // check if email is unique or not
    const existing = await queries.getByEmail(email);
    if (!existing) {
        // hash password by bcrypt
        const passwordHashed = await bcrypt.hash(password, 10)
        // add new user in db
        await queries.create(username, email, passwordHashed);
        return res.status(201).json({
            "message": "register successful, you can now login"
        })
    }
    return res.status(422).json({
        errors: {
            email: { errors: ["email already in use"] }
        }
    })
})
authRoute.post("/login", checkSchema(authSchemaLogin), async (req, res) => {
    // get the data from the body [email , password]
    const { email, password } = req.body
    // check if email exist or not
    const existing = await queries.getByEmail(email);
    if (!existing) {
        return res.status(401).json({ "error": "email or password are invalid" })
    }
    // check password if true or not
    const checkPassword = await bcrypt.compare(password, existing.password)
    if (!checkPassword) {
        return res.status(401).json({ "error": "email or password are invalid" })
    }
    // create session
    req.session.userId = existing.id;
    req.session.user = {
        id: existing.id,
        email: existing.email,
        username: existing.username
    }
    //login successful
    return res.status(200).json({
        "message": "login successful",
        data: {
            user: {
                id: existing.id,
                email: existing.email,
                username: existing.username
            }
        }
    })
})
authRoute.post("/logout", (req, res) => {
    // destroy the cookie from session
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: "logout failed" });
        }
        res.clearCookie("blog_session");
        return res.status(200).json({ message: "logout successful" });
    });
});
authRoute.get("/me", checkAuth, (req, res) => {
    return res.status(200).json({
        data: {
            user: {
                id: req.user.id,
                email: req.user.email,
                username: req.user.username
            }
        }
    });
});
