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
import type { Role } from "@/types";

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<{
    name: string; email: string; password: string; role: Role; image: string;
  }>({ name: "", email: "", password: "", role: "customer", image: "" });

  const validate = (): string | null => {
    if (form.password.length < 6) return "Password min 6 chars";
    if (!/[A-Z]/.test(form.password)) return "Need 1 uppercase";
    if (!/[a-z]/.test(form.password)) return "Need 1 lowercase";
    return null;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) return toast.error(err);
    setLoading(true);
    try {
      const { error } = await authClient.signUp.email({
        name: form.name,
        email: form.email,
        password: form.password,
        ...(form.image ? { image: form.image } : {}),
      });
      if (error) throw new Error(error.message);
      const user = await syncJwtAfterAuth({
        name: form.name, email: form.email, image: form.image, role: form.role,
      });
      window.dispatchEvent(new Event("ph:auth-change"));
      toast.success("Account created");
      router.push(user.role === "vendor" ? "/dashboard/vendor" : "/dashboard/customer");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const google = async () => {
    await authClient.signIn.social({ provider: "google", callbackURL: "/dashboard" });
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-bold mb-1">Create account</h1>
      <p className="text-muted-foreground mb-6">Join PizzaHub today.</p>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <Label>Full Name</Label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div>
          <Label>Email</Label>
          <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div>
          <Label>Password</Label>
          <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <p className="text-xs text-muted-foreground mt-1">Min 6, 1 upper, 1 lower.</p>
        </div>
        <div>
          <Label>Profile Image URL (optional)</Label>
          <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
        </div>
        <div>
          <Label>I am a...</Label>
          <div className="grid grid-cols-2 gap-2 mt-1">
            {(["customer", "vendor"] as Role[]).map((r) => (
              <button type="button" key={r} onClick={() => setForm({ ...form, role: r })}
                className={`rounded-lg border p-3 text-left ${form.role === r ? "border-orange-500 bg-orange-50 dark:bg-orange-950" : ""}`}>
                <span className="font-medium capitalize">{r}</span>
                <p className="text-xs text-muted-foreground">{r === "vendor" ? "Restaurant owner" : "Order pizza"}</p>
              </button>
            ))}
          </div>
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Creating..." : "Create Account"}
        </Button>
        <Button type="button" variant="outline" onClick={google} className="w-full">
          Continue with Google
        </Button>
      </form>
      <p className="text-sm text-center mt-6">
        Have an account? <Link href="/sign-in" className="text-orange-500 font-medium">Sign in</Link>
      </p>
    </div>
  );
}