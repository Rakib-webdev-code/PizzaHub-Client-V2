"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/lib/api";
import { Loader, EmptyState } from "@/components/shared/Loader";
import { Pizza } from "lucide-react";
import type { MenuItem, MenuItemPage, MenuCategory } from "@/types";

const CATEGORIES: MenuCategory[] = [
  "Classic Pizzas", "Vegetarian Pizzas", "Meat Lovers",
  "Specialty / Gourmet Pizzas", "Sides & Appetizers", "Beverages & Desserts",
];

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState<string>("newest");

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category !== "all") params.set("category", category);
    if (location) params.set("location", location);
    if (sort !== "newest") params.set("sort", sort);
    const t = setTimeout(() => {
      api<MenuItemPage>(`/menuItems?${params.toString()}`, { auth: false })
        .then((d) => setItems(d.items || []))
        .catch(() => setItems([]))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(t);
  }, [search, category, location, sort]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-1">Browse Menu</h1>
      <p className="text-muted-foreground mb-6">Find your next favorite pizza.</p>

      <div className="grid gap-3 mb-8 md:grid-cols-4">
        <Input placeholder="Search by name..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Input placeholder="Location..." value={location} onChange={(e) => setLocation(e.target.value)} />
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger><SelectValue placeholder="Sort" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price_asc">Price: Low → High</SelectItem>
            <SelectItem value="price_desc">Price: High → Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? <Loader /> : items.length === 0 ? <EmptyState title="No items found" hint="Try adjusting filters." /> : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <Card key={item._id} className="overflow-hidden h-full hover:shadow-lg transition flex flex-col">
              <div className="aspect-video bg-muted overflow-hidden">
                {item.images?.[0] ? (
                  <img src={item.images[0]} alt={item.itemName} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full"><Pizza className="h-12 w-12 text-muted-foreground" /></div>
                )}
              </div>
              <CardContent className="p-4 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold line-clamp-1">{item.itemName}</h3>
                  {typeof item.vendorId === "object" && item.vendorId.subscriptionPlan === "premium" && (
                    <Badge className="bg-orange-500 shrink-0">Premium</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{item.category} · {item.location}</p>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{item.description}</p>
                <div className="mt-auto pt-3 flex items-center justify-between">
                  <span className="font-bold text-orange-500">${item.price}</span>
                  <Link href={`/menu/${item._id}`}>
                    <Button size="sm">View Details</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}