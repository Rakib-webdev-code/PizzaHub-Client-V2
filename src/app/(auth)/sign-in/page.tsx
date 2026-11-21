"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { syncJwtAfterAuth } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function SignInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await authClient.signIn.email({
        email: form.email, password: form.password,
      });
      if (error) throw new Error(error.message);
      if (!data?.user) throw new Error("Sign-in failed");
      const user = await syncJwtAfterAuth({
        name: data.user.name || data.user.email,
        email: data.user.email,
        image: data.user.image || "",
        role: (data.user as { role?: string }).role || "customer",
      });
      window.dispatchEvent(new Event("ph:auth-change"));
      toast.success("Welcome back");
      const dash =
        user.role === "admin" ? "/dashboard/admin"
        : user.role === "vendor" ? "/dashboard/vendor"
        : "/dashboard/customer";
      router.push(dash);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-bold mb-1">Sign in</h1>
      <p className="text-muted-foreground mb-6">Welcome back to PizzaHub.</p>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <Label>Email</Label>
          <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div>
          <Label>Password</Label>
          <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Signing in..." : "Sign In"}
        </Button>
        <Button type="button" variant="outline" className="w-full"
          onClick={() => authClient.signIn.social({ provider: "google", callbackURL: "/dashboard" })}>
          Continue with Google
        </Button>
      </form>
      <p className="text-sm text-center mt-6">
        New here? <Link href="/sign-up" className="text-orange-500 font-medium">Create account</Link>
      </p>
    </div>
  );
}