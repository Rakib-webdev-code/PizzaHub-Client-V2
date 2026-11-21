"use client";

import type { CurrentUser } from "@/types";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("ph_token");
}

export function setToken(token: string) {
  if (typeof window !== "undefined") localStorage.setItem("ph_token", token);
}

export function clearToken() {
  if (typeof window !== "undefined") localStorage.removeItem("ph_token");
}

interface ApiOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  auth?: boolean;
}

export async function api<T = unknown>(path: string, opts: ApiOptions = {}): Promise<T> {
  const { method = "GET", body, auth = true } = opts;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (auth) {
    const t = getToken();
    if (t) headers.Authorization = `Bearer ${t}`;
  }
  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { message?: string }).message || `Request failed (${res.status})`);
  return data as T;
}

export async function syncJwtAfterAuth(payload: {
  name: string;
  email: string;
  image?: string | null;
  role?: string;
}): Promise<CurrentUser> {
  const data = await api<{ token: string; user: CurrentUser }>("/auth/sync", {
    method: "POST",
    body: payload,
    auth: false,
  });
  setToken(data.token);
  return data.user;
}