"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { StatCard } from "@/components/shared/StatCard";
import { Loader } from "@/components/shared/Loader";
import { Utensils, CheckCircle2, Clock, ThumbsUp } from "lucide-react";
import type { MenuItem, Order } from "@/types";

export default function VendorOverview() {
  const { user } = useCurrentUser();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api<MenuItem[]>("/menuItems/vendor/mine"),
      api<Order[]>("/orders/vendor"),
    ])
      .then(([i, o]) => { setItems(i); setOrders(o); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Vendor Overview</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Items" value={items.length} icon={Utensils} />
        <StatCard label="Active Items" value={items.filter((i) => i.isActive && i.status === "approved").length} icon={CheckCircle2} />
        <StatCard label="Pending Orders" value={orders.filter((o) => o.status === "pending").length} icon={Clock} />
        <StatCard label="Accepted" value={orders.filter((o) => o.status === "accepted").length} icon={ThumbsUp} />
      </div>
      <div className="mt-6 rounded-lg border p-5 bg-muted/30">
        <p className="text-sm text-muted-foreground">Current Plan</p>
        <p className="text-xl font-bold capitalize mt-1">{user?.subscriptionPlan || "free"}</p>
      </div>
    </div>
  );
}