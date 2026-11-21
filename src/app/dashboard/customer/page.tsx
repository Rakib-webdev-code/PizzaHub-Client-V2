"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { StatCard } from "@/components/shared/StatCard";
import { Loader } from "@/components/shared/Loader";
import { ListOrdered, Clock, ThumbsUp, XCircle } from "lucide-react";
import type { Order } from "@/types";

export default function CustomerOverview() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<Order[]>("/orders/mine").then(setOrders).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Customer Overview</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Orders" value={orders.length} icon={ListOrdered} />
        <StatCard label="Pending" value={orders.filter((o) => o.status === "pending").length} icon={Clock} />
        <StatCard label="Accepted" value={orders.filter((o) => o.status === "accepted").length} icon={ThumbsUp} />
        <StatCard label="Rejected" value={orders.filter((o) => o.status === "rejected").length} icon={XCircle} />
      </div>
    </div>
  );
}