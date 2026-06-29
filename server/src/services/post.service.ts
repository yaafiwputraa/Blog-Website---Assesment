import { Prisma } from "@prisma/client";
import { postRepository } from "../repositories/post.repository";
import { AppError } from "../utils/AppError";
import type {
  CreatePostInput,
  UpdatePostInput,
  ListPostsQuery,
} from "../types/post.types";

export const postService = {
  async list(query: ListPostsQuery) {
    const { search, author, page, limit } = query;
    const where: Prisma.PostWhereInput = {};

    if (author) {
      where.authorId = author;
    }
    if (search) {
      // Search by title OR content (case-insensitive).
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }

    const [posts, total] = await Promise.all([
      postRepository.findMany({ skip: (page - 1) * limit, take: limit, where }),
      postRepository.count(where),
    ]);

    return {
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  },

  async getById(id: string) {
    const post = await postRepository.findById(id);
    if (!post) {
      throw new AppError(404, "Post not found");
    }
    return post;
  },

  create(authorId: string, input: CreatePostInput) {
    return postRepository.create({
      title: input.title,
      content: input.content,
      category: input.category ?? null,
      authorId,
    });
  },

  async update(userId: string, postId: string, input: UpdatePostInput) {
    await postService.assertOwner(userId, postId);
    return postRepository.update(postId, {
      title: input.title,
      content: input.content,
      category: input.category ?? null,
    });
  },

  async remove(userId: string, postId: string) {
    await postService.assertOwner(userId, postId);
    await postRepository.delete(postId);
  },

  // Authorization: only the post's author may edit/delete it.
  async assertOwner(userId: string, postId: string) {
    const post = await postRepository.findAuthorId(postId);
    if (!post) {
      throw new AppError(404, "Post not found");
    }
    if (post.authorId !== userId) {
      throw new AppError(403, "You are not allowed to modify this post");
    }
  },
};
