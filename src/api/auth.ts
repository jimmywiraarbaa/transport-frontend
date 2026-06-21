import { api } from "./client";
import { tokenStore } from "./tokens";
import type { User } from "@/types";

interface LoginResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}

export const authApi = {
  login: (username: string, password: string) =>
    api.post<LoginResponse>("/auth/login", { username, password }),

  refresh: () =>
    api.post<LoginResponse>("/auth/refresh", {
      refresh_token: tokenStore.getRefresh(),
    }),

  me: () => api.get<User>("/auth/me"),
};
