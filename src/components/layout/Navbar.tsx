"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { clearToken } from "@/lib/api";
import { Pizza } from "lucide-react";

export function Navbar() {
  const { user, loading } = useCurrentUser();
  const router = useRouter();

  const logout = () => {
    clearToken();
    window.dispatchEvent(new Event("ph:auth-change"));
    router.push("/sign-in");
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Pizza className="h-6 w-6 text-orange-500" />
          PizzaHub
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-orange-500">Home</Link>
          <Link href="/menu" className="hover:text-orange-500">Browse Menu</Link>
          {user && <Link href="/dashboard" className="hover:text-orange-500">Dashboard</Link>}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {!loading && !user && (
            <>
              <Link href="/sign-in"><Button variant="ghost">Sign In</Button></Link>
              <Link href="/sign-up"><Button>Sign Up</Button></Link>
            </>
          )}
          {!loading && user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.image} />
                    <AvatarFallback>{user.name?.[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/dashboard")}>Dashboard</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/profile")}>Profile Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}