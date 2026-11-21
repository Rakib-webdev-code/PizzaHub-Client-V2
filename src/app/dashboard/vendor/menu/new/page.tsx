"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import type { MenuCategory } from "@/types";

const CATEGORIES: MenuCategory[] = [
  "Classic Pizzas", "Vegetarian Pizzas", "Meat Lovers",
  "Specialty / Gourmet Pizzas", "Sides & Appetizers", "Beverages & Desserts",
];

export default function AddMenuItem() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState<string>("");
  const [form, setForm] = useState({
    itemName: "", category: CATEGORIES[0] as MenuCategory,
    description: "", price: "", location: "",
  });

  const uploadImage = async (file: File) => {
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        const { url } = await api<{ url: string }>("/upload", { method: "POST", body: { image: base64 } });
        setImage(url);
        toast.success("Image uploaded");
      };
      reader.readAsDataURL(file);
    } catch (e) {
      toast.error((e as Error).message);
    } finally { setUploading(false); }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return toast.error("Upload an image");
    setLoading(true);
    try {
      await api("/menuItems", {
        method: "POST",
        body: { ...form, price: Number(form.price), images: [image] },
      });
      toast.success("Item submitted — pending admin approval");
      router.push("/dashboard/vendor/menu");
    } catch (e) {
      toast.error((e as Error).message);
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Add Menu Item</h1>
      <form onSubmit={submit} className="space-y-4">
        <div><Label>Item Name</Label><Input required value={form.itemName} onChange={(e) => setForm({ ...form, itemName: e.target.value })} /></div>
        <div>
          <Label>Category</Label>
          <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as MenuCategory })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><Label>Description</Label><Textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><Label>Price ($)</Label><Input required type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
          <div><Label>Location</Label><Input required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Dhanmondi, Dhaka" /></div>
        </div>
        <div>
          <Label>Item Image</Label>
          <Input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f); }} />
          {uploading && <p className="text-sm text-muted-foreground mt-1">Uploading...</p>}
          {image && <img src={image} alt="preview" className="mt-2 h-32 rounded-lg object-cover" />}
        </div>
        <Button type="submit" disabled={loading || uploading} className="w-full">
          {loading ? "Saving..." : "Submit for Approval"}
        </Button>
      </form>
    </div>
  );
}