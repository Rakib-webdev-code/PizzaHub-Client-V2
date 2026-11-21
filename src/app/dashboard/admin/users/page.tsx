"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader } from "@/components/shared/Loader";
import { toast } from "sonner";

interface U { _id: string; name: string; email: string; role: string; isBlocked: boolean; }

export default function ManageUsers() {
  const [users, setUsers] = useState<U[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");

  const reload = () => {
    setLoading(true);
    const p = new URLSearchParams();
    if (search) p.set("search", search);
    if (role !== "all") p.set("role", role);
    api<U[]>(`/users?${p.toString()}`).then(setUsers).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { reload(); }, [search, role]);

  const toggleBlock = async (u: U) => {
    try {
      await api(`/users/${u._id}/${u.isBlocked ? "unblock" : "block"}`, { method: "PATCH" });
      toast.success(u.isBlocked ? "Unblocked" : "Blocked");
      reload();
    } catch (e) { toast.error((e as Error).message); }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>
      <div className="grid gap-3 md:grid-cols-2 mb-6">
        <Input placeholder="Search name/email..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            <SelectItem value="vendor">Vendor</SelectItem>
            <SelectItem value="customer">Customer</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        {users.map((u) => (
          <div key={u._id} className="flex items-center justify-between gap-3 rounded-lg border p-4">
            <div>
              <p className="font-medium">{u.name}</p>
              <p className="text-sm text-muted-foreground">{u.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="capitalize">{u.role}</Badge>
              {u.isBlocked && <Badge variant="destructive">Blocked</Badge>}
              <Button size="sm" variant={u.isBlocked ? "default" : "outline"} onClick={() => toggleBlock(u)}>
                {u.isBlocked ? "Unblock" : "Block"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}