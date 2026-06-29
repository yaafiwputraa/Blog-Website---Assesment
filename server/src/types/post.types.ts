import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  category: z.string().optional(),
});

// Same rules as create (full edit form).
export const updatePostSchema = createPostSchema;

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;

// Query params for listing — search + pagination + optional author filter.
export const listPostsQuerySchema = z.object({
  search: z.string().trim().optional(),
  author: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export type ListPostsQuery = z.infer<typeof listPostsQuerySchema>;
