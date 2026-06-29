import { Request, Response } from "express";
import { userService } from "../services/user.service";
import { AppError } from "../utils/AppError";

export async function getUser(req: Request<{ id: string }>, res: Response) {
  const user = await userService.getProfile(req.params.id);
  res.json({ user });
}

export async function uploadAvatar(req: Request, res: Response) {
  if (!req.file) {
    throw new AppError(400, "No image file provided");
  }
  const user = await userService.updateAvatar(req.userId!, req.file);
  res.json({ user });
}
