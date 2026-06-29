import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { AppError } from "../utils/AppError";

// Add `userId` onto Express's Request type.
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

// Blocks the request unless a valid JWT is present (Bearer header or cookie).
export function protect(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token =
    header && header.startsWith("Bearer ") ? header.slice(7) : req.cookies?.token;

  if (!token) {
    throw new AppError(401, "Not authenticated");
  }

  try {
    const payload = verifyToken(token);
    req.userId = payload.userId;
    next();
  } catch {
    throw new AppError(401, "Invalid or expired token");
  }
}
