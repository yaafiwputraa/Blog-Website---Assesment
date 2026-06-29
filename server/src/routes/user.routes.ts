import { Router } from "express";
import { getUser, uploadAvatar } from "../controllers/user.controller";
import { protect } from "../middleware/auth.middleware";
import { uploadAvatarFile } from "../middleware/upload";

const router = Router();

router.get("/:id", getUser);
router.post("/me/avatar", protect, uploadAvatarFile, uploadAvatar);

export default router;
