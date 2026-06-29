import { z } from "zod";

export const createCommentSchema = z.object({
  content: z.string().min(1, "Comment content is required"),
});

export const updateCommentSchema = createCommentSchema;

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
