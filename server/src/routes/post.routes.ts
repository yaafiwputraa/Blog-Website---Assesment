import { Router } from "express";
import {
  listPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/post.controller";
import { protect } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate";
import { createPostSchema, updatePostSchema } from "../types/post.types";

const router = Router();

router.get("/", listPosts);
router.get("/:id", getPost);
router.post("/", protect, validate(createPostSchema), createPost);
router.put("/:id", protect, validate(updatePostSchema), updatePost);
router.delete("/:id", protect, deletePost);

export default router;
