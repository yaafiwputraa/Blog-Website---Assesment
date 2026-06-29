// Shared types mirroring the backend API responses.

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  createdAt: string;
}

// Author summary embedded in posts and comments.
export interface AuthorSummary {
  id: string;
  name: string;
  avatarUrl: string | null;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  category: string | null;
  createdAt: string;
  updatedAt: string;
  author: AuthorSummary;
  _count: { comments: number };
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: AuthorSummary;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PostListResponse {
  posts: Post[];
  pagination: Pagination;
}
