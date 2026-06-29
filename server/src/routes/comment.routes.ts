import { Router } from "express";
import {
  listComments,
  createComment,
  updateComment,
  deleteComment,
} from "../controllers/comment.controller";
import { protect } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate";
import { createCommentSchema, updateCommentSchema } from "../types/comment.types";

// Mounted at /api/posts/:id/comments — `mergeParams` exposes the post `:id`.
export const postCommentRouter = Router({ mergeParams: true });
postCommentRouter.get("/", listComments);
postCommentRouter.post("/", protect, validate(createCommentSchema), createComment);

// Mounted at /api/comments — `:id` is the comment id.
export const commentRouter = Router();
commentRouter.put("/:id", protect, validate(updateCommentSchema), updateComment);
commentRouter.delete("/:id", protect, deleteComment);
