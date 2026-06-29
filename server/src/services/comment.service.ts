import { commentRepository } from "../repositories/comment.repository";
import { postRepository } from "../repositories/post.repository";
import { AppError } from "../utils/AppError";
import type { CreateCommentInput, UpdateCommentInput } from "../types/comment.types";

export const commentService = {
  async listByPost(postId: string) {
    await commentService.assertPostExists(postId);
    return commentRepository.findByPost(postId);
  },

  async create(userId: string, postId: string, input: CreateCommentInput) {
    await commentService.assertPostExists(postId);
    return commentRepository.create({
      content: input.content,
      postId,
      authorId: userId,
    });
  },

  async update(userId: string, commentId: string, input: UpdateCommentInput) {
    await commentService.assertOwner(userId, commentId);
    return commentRepository.update(commentId, input.content);
  },

  async remove(userId: string, commentId: string) {
    await commentService.assertOwner(userId, commentId);
    await commentRepository.delete(commentId);
  },

  async assertPostExists(postId: string) {
    const post = await postRepository.findAuthorId(postId);
    if (!post) {
      throw new AppError(404, "Post not found");
    }
  },

  // Authorization: only the comment's author may edit/delete it.
  async assertOwner(userId: string, commentId: string) {
    const comment = await commentRepository.findAuthorId(commentId);
    if (!comment) {
      throw new AppError(404, "Comment not found");
    }
    if (comment.authorId !== userId) {
      throw new AppError(403, "You are not allowed to modify this comment");
    }
  },
};
