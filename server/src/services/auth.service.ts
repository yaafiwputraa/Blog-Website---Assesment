import bcrypt from "bcryptjs";
import { userRepository } from "../repositories/user.repository";
import { signToken } from "../utils/jwt";
import { AppError } from "../utils/AppError";
import type { RegisterInput, LoginInput } from "../types/auth.types";

export const authService = {
  async register(input: RegisterInput) {
    const existing = await userRepository.findByEmail(input.email);
    if (existing) {
      throw new AppError(409, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);
    const user = await userRepository.create({
      name: input.name,
      email: input.email,
      password: hashedPassword,
    });

    const token = signToken({ userId: user.id });
    return { user, token };
  },

  async login(input: LoginInput) {
    const user = await userRepository.findByEmail(input.email);
    if (!user) {
      throw new AppError(401, "Invalid email or password");
    }

    const valid = await bcrypt.compare(input.password, user.password);
    if (!valid) {
      throw new AppError(401, "Invalid email or password");
    }

    const token = signToken({ userId: user.id });
    // Return the same public shape as register/getProfile (no password, no updatedAt).
    const publicUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    };
    return { user: publicUser, token };
  },

  async getProfile(userId: string) {
    const user = await userRepository.findPublicById(userId);
    if (!user) {
      throw new AppError(404, "User not found");
    }
    return user;
  },
};
