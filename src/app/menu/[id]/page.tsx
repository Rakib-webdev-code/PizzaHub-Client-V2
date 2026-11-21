"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Loader } from "@/components/shared/Loader";
import { Pizza, MapPin, Store } from "lucide-react";
import { toast } from "sonner";
import type { MenuItem } from "@/types";

export default function ItemDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, loading: userLoading } = useCurrentUser();
  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ deliveryDate: "", deliveryAddress: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api<MenuItem>(`/menuItems/${id}`, { auth: false })
      .then(setItem)
      .catch(() => setItem(null))
      .finally(() => setLoading(false));
  }, [id]);

  const order = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push("/sign-in");
      return;
    }
    if (user.role !== "customer") return toast.error("Only customers can place orders");
    setSubmitting(true);
    try {
      await api("/orders", { method: "POST", body: { itemId: id, ...form } });
      toast.success("Order placed");
      router.push("/dashboard/customer/orders");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || userLoading) return <Loader />;
  if (!item) return <div className="mx-auto max-w-3xl px-4 py-20 text-center">Item not found.</div>;

  const vendor = typeof item.vendorId === "object" ? item.vendorId : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 grid lg:grid-cols-2 gap-10">
      <div>
        <div className="aspect-video bg-muted rounded-xl overflow-hidden">
          {item.images?.[0] ? (
            <img src={item.images[0]} alt={item.itemName} className="h-full w-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full"><Pizza className="h-16 w-16 text-muted-foreground" /></div>
          )}
        </div>
        {item.images.length > 1 && (
          <div className="grid grid-cols-4 gap-2 mt-3">
            {item.images.slice(1, 5).map((img, i) => (
              <img key={i} src={img} alt="" className="aspect-square object-cover rounded-lg" />
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-3xl font-bold">{item.itemName}</h1>
          {vendor?.subscriptionPlan === "premium" && <Badge className="bg-orange-500">Premium</Badge>}
        </div>
        <p className="text-sm text-muted-foreground mt-1">{item.category}</p>
        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {item.location}</span>
          <span className="flex items-center gap-1"><Store className="h-4 w-4" /> {vendor?.businessName || vendor?.name}</span>
        </div>
        <p className="mt-6 text-foreground/80">{item.description}</p>
        <p className="text-3xl font-bold text-orange-500 mt-6">${item.price}</p>

        <Card className="mt-6">
          <CardContent className="p-5">
            <h2 className="font-semibold mb-3">Place Order</h2>
            <form onSubmit={order} className="space-y-3">
              <div>
                <Label>Delivery Date</Label>
                <Input type="date" required value={form.deliveryDate}
                  onChange={(e) => setForm({ ...form, deliveryDate: e.target.value })} />
              </div>
              <div>
                <Label>Delivery Address</Label>
                <Input required value={form.deliveryAddress}
                  onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })} />
              </div>
              <div>
                <Label>Special Instructions</Label>
                <Textarea value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </div>
              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? "Placing..." : user ? "Order Now" : "Sign in to Order"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}