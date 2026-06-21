import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { authApi } from "@/api/auth";

/** Fetches the user profile on mount if a token exists but user is null. */
export function useAuthBootstrap() {
  const { isAuthenticated, user, setAuth, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || user) return;
    authApi
      .me()
      .then((u) => {
        // Token is still valid — populate user without re-setting tokens.
        useAuthStore.setState({ user: u });
      })
      .catch(() => {
        logout();
      });
  }, [isAuthenticated, user, setAuth, logout]);
}
