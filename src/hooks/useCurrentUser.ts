"use client";
import { useEffect, useState } from "react";
import { api, getToken, clearToken } from "@/lib/api";
import type { CurrentUser } from "@/types";

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    if (!getToken()) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const me = await api<CurrentUser>("/auth/me");
      setUser(me);
    } catch {
      clearToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
    const handler = () => reload();
    window.addEventListener("ph:auth-change", handler);
    return () => window.removeEventListener("ph:auth-change", handler);
  }, []);

  return { user, loading, reload };
}