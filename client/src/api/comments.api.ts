import { api } from "./client";
import type { Comment } from "../types";

export interface CommentPayload {
  content: string;
}

export const commentsApi = {
  async listByPost(postId: string) {
    const { data } = await api.get<{ comments: Comment[] }>(`/posts/${postId}/comments`);
    return data.comments;
  },

  async create(postId: string, payload: CommentPayload) {
    const { data } = await api.post<{ comment: Comment }>(
      `/posts/${postId}/comments`,
      payload
    );
    return data.comment;
  },

  async update(commentId: string, payload: CommentPayload) {
    const { data } = await api.put<{ comment: Comment }>(`/comments/${commentId}`, payload);
    return data.comment;
  },

  async remove(commentId: string) {
    const { data } = await api.delete<{ message: string }>(`/comments/${commentId}`);
    return data;
  },
};
