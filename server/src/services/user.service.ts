import { userRepository } from "../repositories/user.repository";
import { AppError } from "../utils/AppError";
import { cloudinary, isCloudinaryConfigured } from "../config/cloudinary";

export const userService = {
  async getProfile(userId: string) {
    const user = await userRepository.findPublicById(userId);
    if (!user) {
      throw new AppError(404, "User not found");
    }
    return user;
  },

  async updateAvatar(userId: string, file: Express.Multer.File) {
    if (!isCloudinaryConfigured) {
      throw new AppError(503, "Image upload is not configured on the server");
    }
    const url = await uploadToCloudinary(file.buffer);
    return userRepository.updateAvatar(userId, url);
  },
};

// Streams an in-memory image buffer to Cloudinary and resolves its secure URL.
function uploadToCloudinary(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "blog-avatars", resource_type: "image" },
      (error, result) => {
        if (error || !result) {
          return reject(error ?? new Error("Image upload failed"));
        }
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}
