"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { Loader, EmptyState } from "@/components/shared/Loader";
import { Pizza, Truck, ShieldCheck, ChefHat } from "lucide-react";
import type { MenuItem, MenuItemPage, MenuCategory } from "@/types";

const CATEGORIES: MenuCategory[] = [
  "Classic Pizzas", "Vegetarian Pizzas", "Meat Lovers",
  "Specialty / Gourmet Pizzas", "Sides & Appetizers", "Beverages & Desserts",
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08 } }),
};

export default function HomePage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<MenuItemPage>("/menuItems?limit=6", { auth: false })
      .then((d) => setItems(d.items || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-500 to-red-600 text-white">
        <div className="mx-auto max-w-7xl px-4 py-20 md:py-28 grid md:grid-cols-2 gap-10 items-center">
          <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
            <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl font-extrabold leading-tight">
              Hot & Fresh Pizza<br />Delivered to Your Door
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-4 text-lg opacity-90 max-w-lg">
              Discover local pizza shops, order in seconds, and track your delivery in real time.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-6">
              <Link href="/menu">
                <Button size="lg" variant="secondary" className="text-orange-600 font-semibold">
                  Explore Pizza Menu
                </Button>
              </Link>
            </motion.div>
          </motion.div>
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }}
            className="relative flex justify-center">
            <div className="h-72 w-72 md:h-96 md:w-96 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
              <Pizza className="h-40 w-40 md:h-56 md:w-56 text-white" strokeWidth={1} />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold">Featured Menu</h2>
            <p className="text-muted-foreground">Hand-picked pizzas from our premium vendors.</p>
          </div>
          <Link href="/menu" className="text-orange-500 font-medium">See all →</Link>
        </div>
        {loading ? <Loader /> : items.length === 0 ? <EmptyState title="No items yet" hint="Check back soon!" /> : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, i) => (
              <motion.div key={item._id} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <Link href={`/menu/${item._id}`}>
                  <Card className="overflow-hidden h-full hover:shadow-lg transition">
                    <div className="aspect-video bg-muted overflow-hidden">
                      {item.images?.[0] ? (
                        <img src={item.images[0]} alt={item.itemName} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full"><Pizza className="h-12 w-12 text-muted-foreground" /></div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-semibold line-clamp-1">{item.itemName}</h3>
                        {typeof item.vendorId === "object" && item.vendorId.subscriptionPlan === "premium" && (
                          <Badge className="bg-orange-500">Premium</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{item.category} · {item.location}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="font-bold text-orange-500">${item.price}</span>
                        <span className="text-xs text-muted-foreground">
                          {typeof item.vendorId === "object" ? (item.vendorId.businessName || item.vendorId.name) : ""}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-muted/40 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-3xl font-bold mb-6 text-center">Pizza Categories</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {CATEGORIES.map((c, i) => (
              <motion.div key={c} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <Link href={`/menu?category=${encodeURIComponent(c)}`}>
                  <Card className="hover:bg-orange-50 dark:hover:bg-orange-950 transition cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <Pizza className="h-10 w-10 mx-auto text-orange-500 mb-2" />
                      <p className="font-medium">{c}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Why Choose PizzaHub?</h2>
        <div className="grid gap-6 md:grid-cols-4">
          {[
            { icon: ChefHat, title: "Local Chefs", text: "Authentic recipes from nearby pizzerias." },
            { icon: Truck, title: "Fast Delivery", text: "Hot and fresh, at your door in minutes." },
            { icon: ShieldCheck, title: "Secure Payment", text: "Trusted vendors, verified transactions." },
            { icon: Pizza, title: "Endless Menu", text: "From classic to gourmet — you choose." },
          ].map((b, i) => (
            <motion.div key={b.title} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} custom={i}>
              <Card className="text-center h-full">
                <CardContent className="p-6">
                  <b.icon className="h-10 w-10 mx-auto text-orange-500 mb-3" />
                  <h3 className="font-semibold mb-1">{b.title}</h3>
                  <p className="text-sm text-muted-foreground">{b.text}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-orange-500 text-white py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">How PizzaHub Works</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {[
              { n: "1", t: "Browse", d: "Explore menus from local vendors." },
              { n: "2", t: "Order", d: "Pick a pizza, set date & address." },
              { n: "3", t: "Enjoy", d: "Track status and dig in." },
            ].map((s) => (
              <div key={s.n} className="bg-white/10 rounded-xl p-6 backdrop-blur">
                <div className="text-3xl font-bold">{s.n}</div>
                <p className="font-semibold mt-2">{s.t}</p>
                <p className="text-sm opacity-90 mt-1">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}