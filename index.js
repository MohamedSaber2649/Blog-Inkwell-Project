import express from "express";
import { pagesRouter } from "./routes/pages.routes.js";
import { Sessions } from "./middleware/sessionTable.js";
import { authRoute } from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import { postsRoute } from "./routes/posts.routes.js";
import { toggleRoute } from "./routes/toggleLikes.routes.js";
import { commentRoute } from "./routes/comment.routes.js";
const app = express();
process.loadEnvFile();
const port = process.env.PORT
app.use((req, res, next) => {
  console.log(new Date().toLocaleString(), req.method, req.url);
  next();
});
app.use(express.json());
app.use(cookieParser());
app.use(Sessions);
app.use("/auth", authRoute);
app.use("/api", postsRoute)
app.use("/api/posts", toggleRoute)
app.use("/api/posts", commentRoute)
app.use("/uploads", express.static("uploads")) // to load the image in Blog site
app.use(pagesRouter);
app.use((err, req, res, next) => {
  console.log("err", err);
  res.status(500).json({ error: "something went wrong" });
});
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
