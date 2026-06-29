import { api } from "./client";
import type { User } from "../types";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authApi = {
  async register(payload: RegisterPayload) {
    const { data } = await api.post<AuthResponse>("/auth/register", payload);
    return data;
  },

  async login(payload: LoginPayload) {
    const { data } = await api.post<AuthResponse>("/auth/login", payload);
    return data;
  },

  async logout() {
    const { data } = await api.post<{ message: string }>("/auth/logout");
    return data;
  },

  async getMe() {
    const { data } = await api.get<{ user: User }>("/auth/me");
    return data.user;
  },
};
