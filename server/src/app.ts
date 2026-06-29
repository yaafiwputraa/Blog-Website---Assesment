import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import postRoutes from "./routes/post.routes";
import userRoutes from "./routes/user.routes";
import { postCommentRouter, commentRouter } from "./routes/comment.routes";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/posts/:id/comments", postCommentRouter);
app.use("/api/comments", commentRouter);
app.use("/api/users", userRoutes);

// Error handler must be the LAST middleware.
app.use(errorHandler);

export default app;
