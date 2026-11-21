"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Role } from "@/types";
import {
  LayoutDashboard, Utensils, PlusCircle, ListOrdered, CreditCard,
  Users, Package, Receipt, UserCircle,
} from "lucide-react";

const LINKS: Record<Role, { href: string; label: string; icon: React.ElementType }[]> = {
  vendor: [
    { href: "/dashboard/vendor", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/vendor/menu", label: "My Menu Items", icon: Utensils },
    { href: "/dashboard/vendor/menu/new", label: "Add Menu Item", icon: PlusCircle },
    { href: "/dashboard/vendor/orders", label: "Customer Orders", icon: ListOrdered },
    { href: "/dashboard/vendor/subscription", label: "Subscription", icon: CreditCard },
    { href: "/profile", label: "Profile", icon: UserCircle },
  ],
  customer: [
    { href: "/dashboard/customer", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/customer/orders", label: "My Orders", icon: ListOrdered },
    { href: "/profile", label: "Profile", icon: UserCircle },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/admin/users", label: "Manage Users", icon: Users },
    { href: "/dashboard/admin/menu", label: "Manage Menu", icon: Package },
    { href: "/dashboard/admin/transactions", label: "Transactions", icon: Receipt },
    { href: "/profile", label: "Profile", icon: UserCircle },
  ],
};

export function DashboardSidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex w-64 shrink-0 border-r min-h-[calc(100vh-4rem)] bg-muted/30">
      <nav className="w-full p-4 space-y-1">
        {LINKS[role].map((l) => (
          <Link key={l.href} href={l.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-orange-100 dark:hover:bg-orange-950",
              pathname === l.href && "bg-orange-500 text-white hover:bg-orange-500"
            )}>
            <l.icon className="h-4 w-4" /> {l.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}