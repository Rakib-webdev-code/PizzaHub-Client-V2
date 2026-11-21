import Link from "next/link";
import { Pizza, Facebook, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t mt-16 bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-10 grid gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-bold text-lg">
            <Pizza className="h-6 w-6 text-orange-500" /> PizzaHub
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Hot & fresh pizza delivered from your favorite local shops.
          </p>
        </div>
        <div>
          <p className="font-semibold mb-2">Explore</p>
          <ul className="space-y-1 text-sm">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/menu">Browse Menu</Link></li>
            <li><Link href="/sign-up">Become a Vendor</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold mb-2">Contact</p>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>pizzahub.bd@gmail.com</li>
            <li>+880 1234 567 890</li>
            <li>Dhaka, Bangladesh</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold mb-2">Follow</p>
          <div className="flex gap-3">
            <a href="#" aria-label="Facebook"><Facebook className="h-5 w-5" /></a>
            <a href="#" aria-label="X">
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                <path d="M18.9 2H22l-7.1 8.1L23 22h-6.8l-5.3-6.9L4.8 22H1.7l7.6-8.7L1 2h7l4.8 6.3L18.9 2z" />
              </svg>
            </a>
            <a href="#" aria-label="Instagram"><Instagram className="h-5 w-5" /></a>
          </div>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} PizzaHub. All rights reserved.
      </div>
    </footer>
  );
}