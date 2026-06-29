import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";

export const commentSelect = {
  id: true,
  content: true,
  createdAt: true,
  updatedAt: true,
  author: { select: { id: true, name: true, avatarUrl: true } },
} satisfies Prisma.CommentSelect;

export const commentRepository = {
  findByPost(postId: string) {
    return prisma.comment.findMany({
      where: { postId },
      select: commentSelect,
      orderBy: { createdAt: "asc" },
    });
  },

  create(data: { content: string; postId: string; authorId: string }) {
    return prisma.comment.create({ data, select: commentSelect });
  },

  update(id: string, content: string) {
    return prisma.comment.update({
      where: { id },
      data: { content },
      select: commentSelect,
    });
  },

  delete(id: string) {
    return prisma.comment.delete({ where: { id } });
  },

  // Lightweight fetch used for authorization checks.
  findAuthorId(id: string) {
    return prisma.comment.findUnique({ where: { id }, select: { authorId: true } });
  },
};
