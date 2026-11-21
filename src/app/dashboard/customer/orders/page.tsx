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

export default function CustomerOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = () =>
    api<Order[]>("/orders/mine").then(setOrders).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { reload(); }, []);

  const cancel = async (id: string) => {
    if (!confirm("Cancel this order?")) return;
    try {
      await api(`/orders/${id}/cancel`, { method: "PATCH" });
      toast.success("Order cancelled");
      reload();
    } catch (e) { toast.error((e as Error).message); }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      {orders.length === 0 ? <EmptyState title="No orders yet" hint="Browse the menu to place one." /> : (
        <div className="space-y-4">
          {orders.map((o) => {
            const item = typeof o.itemId === "object" ? o.itemId : null;
            const vendor = typeof o.vendorId === "object" ? o.vendorId : null;
            return (
              <Card key={o._id}>
                <CardContent className="p-5 flex gap-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted shrink-0">
                    {item?.images?.[0] && <img src={item.images[0]} alt="" className="h-full w-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold">{item?.itemName}</h3>
                        <p className="text-sm text-muted-foreground">{vendor?.businessName || vendor?.name}</p>
                      </div>
                      <Badge variant="outline" className="capitalize">{o.status}</Badge>
                    </div>
                    <p className="text-sm mt-2">Delivery: {new Date(o.deliveryDate).toLocaleDateString()}</p>
                    <p className="text-sm">Address: {o.deliveryAddress}</p>
                    <OrderStatusTimeline status={o.status} />
                    {o.status === "pending" && (
                      <Button size="sm" variant="outline" onClick={() => cancel(o._id)}>Cancel Order</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}