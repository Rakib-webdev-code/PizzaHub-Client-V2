"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { StatCard } from "@/components/shared/StatCard";
import { Loader } from "@/components/shared/Loader";
import { Users, Store, UserCircle, Package, Clock, Receipt } from "lucide-react";
import type { Transaction } from "@/types";

interface AdminUser { _id: string; role: string; }
interface AdminItem { _id: string; status: string; }

export default function AdminOverview() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [items, setItems] = useState<AdminItem[]>([]);
  const [tx, setTx] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api<AdminUser[]>("/users"),
      api<AdminItem[]>("/menuItems/admin/all"),
      api<Transaction[]>("/transactions"),
    ])
      .then(([u, i, t]) => { setUsers(u); setItems(i); setTx(t); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Overview</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total Users" value={users.length} icon={Users} />
        <StatCard label="Vendors" value={users.filter((u) => u.role === "vendor").length} icon={Store} />
        <StatCard label="Customers" value={users.filter((u) => u.role === "customer").length} icon={UserCircle} />
        <StatCard label="Menu Items" value={items.length} icon={Package} />
        <StatCard label="Pending Items" value={items.filter((i) => i.status === "pending").length} icon={Clock} />
        <StatCard label="Transactions" value={tx.length} icon={Receipt} />
      </div>
    </div>
  );
}