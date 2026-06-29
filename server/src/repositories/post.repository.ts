import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";

// Shape returned for posts: includes author summary and comment count.
export const postSelect = {
  id: true,
  title: true,
  content: true,
  category: true,
  createdAt: true,
  updatedAt: true,
  author: { select: { id: true, name: true, avatarUrl: true } },
  _count: { select: { comments: true } },
} satisfies Prisma.PostSelect;

export const postRepository = {
  findMany(params: { skip: number; take: number; where: Prisma.PostWhereInput }) {
    return prisma.post.findMany({
      where: params.where,
      select: postSelect,
      orderBy: { createdAt: "desc" },
      skip: params.skip,
      take: params.take,
    });
  },

  count(where: Prisma.PostWhereInput) {
    return prisma.post.count({ where });
  },

  findById(id: string) {
    return prisma.post.findUnique({ where: { id }, select: postSelect });
  },

  create(data: {
    title: string;
    content: string;
    category: string | null;
    authorId: string;
  }) {
    return prisma.post.create({ data, select: postSelect });
  },

  update(
    id: string,
    data: { title: string; content: string; category: string | null }
  ) {
    return prisma.post.update({ where: { id }, data, select: postSelect });
  },

  delete(id: string) {
    return prisma.post.delete({ where: { id } });
  },

  // Lightweight fetch used for authorization checks.
  findAuthorId(id: string) {
    return prisma.post.findUnique({ where: { id }, select: { authorId: true } });
  },
};
