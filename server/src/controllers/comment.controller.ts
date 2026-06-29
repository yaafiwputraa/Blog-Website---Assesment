import { Request, Response } from "express";
import { commentService } from "../services/comment.service";

// For nested routes the `id` param is the POST id; for standalone it is the COMMENT id.
export async function listComments(req: Request<{ id: string }>, res: Response) {
  const comments = await commentService.listByPost(req.params.id);
  res.json({ comments });
}

export async function createComment(req: Request<{ id: string }>, res: Response) {
  const comment = await commentService.create(req.userId!, req.params.id, req.body);
  res.status(201).json({ comment });
}

export async function updateComment(req: Request<{ id: string }>, res: Response) {
  const comment = await commentService.update(req.userId!, req.params.id, req.body);
  res.json({ comment });
}

export async function deleteComment(req: Request<{ id: string }>, res: Response) {
  await commentService.remove(req.userId!, req.params.id);
  res.json({ message: "Comment deleted successfully" });
}
