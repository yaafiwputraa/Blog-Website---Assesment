import { api } from "./client";
import type { User } from "../types";

export const usersApi = {
  async getById(id: string) {
    const { data } = await api.get<{ user: User }>(`/users/${id}`);
    return data.user;
  },

  async uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append("avatar", file);

    const { data } = await api.post<{ user: User }>("/users/me/avatar", formData);
    return data.user;
  },
};
