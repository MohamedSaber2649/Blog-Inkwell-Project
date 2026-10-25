export const checkAuth = (req, res, next) => {
    // check if session and userId exist or not
    if (req.session && req.session.userId) {
        req.user = req.session.user;
        return next();
    }
    return res.status(401).json({ error: "invalid session" });
};