import multer from "multer";
import { AppError } from "../utils/AppError";

// Keep the file in memory so we can stream it straight to Cloudinary.
const storage = multer.memoryStorage();

export const uploadAvatarFile = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new AppError(400, "Only image files are allowed"));
    }
  },
}).single("avatar");
