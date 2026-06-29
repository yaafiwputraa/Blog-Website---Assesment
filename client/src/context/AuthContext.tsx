import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { authApi, type LoginPayload, type RegisterPayload } from "../api/auth.api";
import type { User } from "../types";
import { AuthContext } from "./auth-context";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const storedToken = localStorage.getItem("token");

    async function restoreSession() {
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const restoredUser = await authApi.getMe();
        if (isMounted) {
          setUser(restoredUser);
          setToken(storedToken);
        }
      } catch (error) {
        console.warn("Session restore failed", error);
        localStorage.removeItem("token");
        if (isMounted) {
          setUser(null);
          setToken(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const response = await authApi.login(payload);
    localStorage.setItem("token", response.token);
    setToken(response.token);
    setUser(response.user);
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const response = await authApi.register(payload);
    localStorage.setItem("token", response.token);
    setToken(response.token);
    setUser(response.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.warn("Logout request failed", error);
    } finally {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    }
  }, []);

  const updateUser = useCallback((nextUser: User) => {
    setUser(nextUser);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      register,
      logout,
      updateUser,
    }),
    [loading, login, logout, register, token, updateUser, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
