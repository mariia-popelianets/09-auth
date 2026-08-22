"use client";

import { useEffect } from "react";
import { checkSession, getMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated,
  );

  useEffect(() => {
    const initAuth = async () => {
      const isValid = await checkSession();
      if (isValid) {
        try {
          const user = await getMe();
          if (user) setUser(user);
        } catch {
          clearIsAuthenticated();
        }
      } else {
        clearIsAuthenticated();
      }
    };

    initAuth();
  }, [setUser, clearIsAuthenticated]);

  return <>{children}</>;
}
