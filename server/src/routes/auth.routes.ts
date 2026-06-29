import { Router } from "express";
import { register, login, logout, getMe } from "../controllers/auth.controller";
import { validate } from "../middleware/validate";
import { protect } from "../middleware/auth.middleware";
import { registerSchema, loginSchema } from "../types/auth.types";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.get("/me", protect, getMe);

export default router;
