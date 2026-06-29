import { api } from "./client";
import type { Post, PostListResponse } from "../types";

export interface ListPostsParams {
  search?: string;
  author?: string;
  page?: number;
  limit?: number;
}

export interface PostPayload {
  title: string;
  content: string;
  category?: string;
}

export const postsApi = {
  async list(params: ListPostsParams = {}) {
    const { data } = await api.get<PostListResponse>("/posts", { params });
    return data;
  },

  async getById(id: string) {
    const { data } = await api.get<{ post: Post }>(`/posts/${id}`);
    return data.post;
  },

  async create(payload: PostPayload) {
    const { data } = await api.post<{ post: Post }>("/posts", payload);
    return data.post;
  },

  async update(id: string, payload: PostPayload) {
    const { data } = await api.put<{ post: Post }>(`/posts/${id}`, payload);
    return data.post;
  },

  async remove(id: string) {
    const { data } = await api.delete<{ message: string }>(`/posts/${id}`);
    return data;
  },
};
