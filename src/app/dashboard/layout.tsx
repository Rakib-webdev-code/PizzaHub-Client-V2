"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { Loader } from "@/components/shared/Loader";
import type { Role } from "@/types";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useCurrentUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!user) { router.replace("/sign-in"); return; }
    const seg = pathname.split("/")[2];
    const expectedRole: Role | undefined =
      seg === "vendor" ? "vendor" : seg === "customer" ? "customer" : seg === "admin" ? "admin" : undefined;
    if (expectedRole && user.role !== expectedRole) {
      const dash =
        user.role === "admin" ? "/dashboard/admin"
        : user.role === "vendor" ? "/dashboard/vendor"
        : "/dashboard/customer";
      router.replace(dash);
    }
  }, [user, loading, pathname, router]);

  if (loading || !user) return <Loader label="Checking access..." />;

  return (
    <div className="flex">
      <DashboardSidebar role={user.role} />
      <div className="flex-1 min-w-0 p-6">{children}</div>
    </div>
  );
}