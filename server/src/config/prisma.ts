import { PrismaClient } from "@prisma/client";

// Single shared Prisma instance to avoid exhausting DB connections.
export const prisma = new PrismaClient();
