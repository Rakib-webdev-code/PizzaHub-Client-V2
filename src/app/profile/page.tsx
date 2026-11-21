"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "@/components/shared/Loader";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, loading, reload } = useCurrentUser();
  const [form, setForm] = useState({ name: "", image: "", businessName: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) setForm({ name: user.name, image: user.image || "", businessName: user.businessName || "" });
  }, [user]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api("/users/me", { method: "PATCH", body: form });
      toast.success("Profile updated");
      reload();
    } catch (e) { toast.error((e as Error).message); }
    finally { setSaving(false); }
  };

  if (loading || !user) return <Loader />;

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
      <form onSubmit={submit} className="space-y-4">
        <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
        <div><Label>Email</Label><Input value={user.email} disabled /></div>
        <div><Label>Profile Image URL</Label><Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} /></div>
        {user.role === "vendor" && (
          <div><Label>Business Name</Label><Input value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} /></div>
        )}
        <Button type="submit" disabled={saving} className="w-full">{saving ? "Saving..." : "Save Changes"}</Button>
      </form>
    </div>
  );
}