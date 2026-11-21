"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Loader } from "@/components/shared/Loader";

export default function DashboardIndex() {
  const { user, loading } = useCurrentUser();
  const router = useRouter();
  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/sign-in");
    else if (user.role === "admin") router.replace("/dashboard/admin");
    else if (user.role === "vendor") router.replace("/dashboard/vendor");
    else router.replace("/dashboard/customer");
  }, [user, loading, router]);
  return <Loader />;
}