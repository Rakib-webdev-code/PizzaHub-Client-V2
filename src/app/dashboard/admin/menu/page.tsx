"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader } from "@/components/shared/Loader";
import { toast } from "sonner";
import type { MenuItem } from "@/types";

export default function AdminMenu() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const reload = () => {
    setLoading(true);
    const p = new URLSearchParams();
    if (search) p.set("search", search);
    if (status !== "all") p.set("status", status);
    api<MenuItem[]>(`/menuItems/admin/all?${p.toString()}`)
      .then(setItems).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { reload(); }, [search, status]);

  const setItemStatus = async (id: string, s: string) => {
    try {
      await api(`/menuItems/${id}/status`, { method: "PATCH", body: { status: s } });
      toast.success(`Marked ${s}`);
      reload();
    } catch (e) { toast.error((e as Error).message); }
  };

  const del = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    try {
      await api(`/menuItems/admin/${id}`, { method: "DELETE" });
      toast.success("Deleted");
      reload();
    } catch (e) { toast.error((e as Error).message); }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Menu Items</h1>
      <div className="grid gap-3 md:grid-cols-2 mb-6">
        <Input placeholder="Search by name..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        {items.map((it) => (
          <div key={it._id} className="flex items-center justify-between gap-3 rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded bg-muted overflow-hidden">
                {it.images?.[0] && <img src={it.images[0]} alt="" className="w-full h-full object-cover" />}
              </div>
              <div>
                <p className="font-medium">{it.itemName}</p>
                <p className="text-sm text-muted-foreground">${it.price} · {it.category}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="capitalize">{it.status}</Badge>
              {it.status === "pending" && (
                <>
                  <Button size="sm" onClick={() => setItemStatus(it._id, "approved")}>Approve</Button>
                  <Button size="sm" variant="outline" onClick={() => setItemStatus(it._id, "rejected")}>Reject</Button>
                </>
              )}
              <Button size="sm" variant="destructive" onClick={() => del(it._id)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}