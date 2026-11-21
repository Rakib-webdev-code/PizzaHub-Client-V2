"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Loader, EmptyState } from "@/components/shared/Loader";
import { toast } from "sonner";
import type { MenuItem } from "@/types";

export default function VendorMenuList() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = () =>
    api<MenuItem[]>("/menuItems/vendor/mine")
      .then(setItems)
      .catch(() => {})
      .finally(() => setLoading(false));

  useEffect(() => { reload(); }, []);

  const del = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    try {
      await api(`/menuItems/${id}`, { method: "DELETE" });
      toast.success("Deleted");
      reload();
    } catch (e) { toast.error((e as Error).message); }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Menu Items</h1>
        <Link href="/dashboard/vendor/menu/new"><Button>Add New</Button></Link>
      </div>
      {items.length === 0 ? <EmptyState title="No items yet" hint="Click Add New to create your first item." /> : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <Card key={it._id}>
              <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                {it.images?.[0] && <img src={it.images[0]} alt="" className="h-full w-full object-cover" />}
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{it.itemName}</h3>
                  <Badge variant={it.status === "approved" ? "default" : "secondary"}>{it.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">${it.price} · {it.category}</p>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline" onClick={() => del(it._id)}>Delete</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}