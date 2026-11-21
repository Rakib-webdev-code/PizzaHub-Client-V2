"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader, EmptyState } from "@/components/shared/Loader";
import { OrderStatusTimeline } from "@/components/shared/OrderStatusTimeline";
import { toast } from "sonner";
import type { Order } from "@/types";

export default function VendorOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = () =>
    api<Order[]>("/orders/vendor").then(setOrders).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { reload(); }, []);

  const decide = async (id: string, decision: "accepted" | "rejected") => {
    try {
      await api(`/orders/${id}/decision`, { method: "PATCH", body: { decision } });
      toast.success(`Order ${decision}`);
      reload();
    } catch (e) { toast.error((e as Error).message); }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Customer Orders</h1>
      {orders.length === 0 ? <EmptyState title="No orders yet" /> : (
        <div className="space-y-4">
          {orders.map((o) => {
            const item = typeof o.itemId === "object" ? o.itemId : null;
            const customer = typeof o.customerId === "object" ? o.customerId : null;
            return (
              <Card key={o._id}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <h3 className="font-semibold">{item?.itemName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {customer?.name} · {customer?.email}
                      </p>
                      <p className="text-sm mt-2">Delivery: {new Date(o.deliveryDate).toLocaleDateString()}</p>
                      <p className="text-sm">Address: {o.deliveryAddress}</p>
                      {o.message && <p className="text-sm text-muted-foreground italic mt-1">"{o.message}"</p>}
                    </div>
                    <Badge variant="outline" className="capitalize">{o.status}</Badge>
                  </div>
                  <OrderStatusTimeline status={o.status} />
                  {o.status === "pending" && (
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" onClick={() => decide(o._id, "accepted")}>Accept</Button>
                      <Button size="sm" variant="outline" onClick={() => decide(o._id, "rejected")}>Reject</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}