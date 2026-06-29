import { Request, Response } from "express";
import { authService } from "../services/auth.service";

// httpOnly cookie holding the JWT (secondary to the Bearer header).
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export async function register(req: Request, res: Response) {
  const { user, token } = await authService.register(req.body);
  res.cookie("token", token, cookieOptions);
  res.status(201).json({ user, token });
}

export async function login(req: Request, res: Response) {
  const { user, token } = await authService.login(req.body);
  res.cookie("token", token, cookieOptions);
  res.json({ user, token });
}

export async function logout(_req: Request, res: Response) {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
}

export async function getMe(req: Request, res: Response) {
  const user = await authService.getProfile(req.userId!);
  res.json({ user });
}
