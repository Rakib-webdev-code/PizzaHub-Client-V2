const reload = async () => {
  if (!getToken()) {
    // Try to re-sync from Better Auth
    try {
      const { authClient } = await import("@/lib/auth-client");
      const { data } = await authClient.getSession();
      if (data?.user) {
        const u = await syncJwtAfterAuth({
          name: data.user.name || data.user.email,
          email: data.user.email,
          image: data.user.image || "",
          role: (data.user as { role?: string }).role || "customer",
        });
        setUser(u);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
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