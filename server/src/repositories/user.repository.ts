import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";

// Fields safe to expose (never the password).
export const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  avatarUrl: true,
  createdAt: true,
} satisfies Prisma.UserSelect;

export const userRepository = {
  // Full record (incl. password) — needed for login comparison.
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  findPublicById(id: string) {
    return prisma.user.findUnique({ where: { id }, select: publicUserSelect });
  },

  create(data: { name: string; email: string; password: string }) {
    return prisma.user.create({ data, select: publicUserSelect });
  },

  updateAvatar(id: string, avatarUrl: string) {
    return prisma.user.update({
      where: { id },
      data: { avatarUrl },
      select: publicUserSelect,
    });
  },
};
