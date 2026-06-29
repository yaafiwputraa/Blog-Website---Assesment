import { Request, Response } from "express";
import { postService } from "../services/post.service";
import { listPostsQuerySchema } from "../types/post.types";

export async function listPosts(req: Request, res: Response) {
  // Query params are validated here (req.query is read-only in Express 5).
  const query = listPostsQuerySchema.parse(req.query);
  const result = await postService.list(query);
  res.json(result);
}

export async function getPost(req: Request<{ id: string }>, res: Response) {
  const post = await postService.getById(req.params.id);
  res.json({ post });
}

export async function createPost(req: Request, res: Response) {
  const post = await postService.create(req.userId!, req.body);
  res.status(201).json({ post });
}

export async function updatePost(req: Request<{ id: string }>, res: Response) {
  const post = await postService.update(req.userId!, req.params.id, req.body);
  res.json({ post });
}

export async function deletePost(req: Request<{ id: string }>, res: Response) {
  await postService.remove(req.userId!, req.params.id);
  res.json({ message: "Post deleted successfully" });
}
