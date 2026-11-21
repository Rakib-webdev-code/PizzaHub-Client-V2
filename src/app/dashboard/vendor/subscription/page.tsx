"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

export default function SubscriptionPage() {
  const { user } = useCurrentUser();
  const [loading, setLoading] = useState(false);
  const isPremium = user?.subscriptionPlan === "premium";

  const upgrade = async () => {
    setLoading(true);
    try {
      const { url } = await api<{ url: string }>("/stripe/checkout", { method: "POST" });
      window.location.href = url;
    } catch (e) { toast.error((e as Error).message); setLoading(false); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Subscription</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Free</h2>
              {!isPremium && <Badge>Current</Badge>}
            </div>
            <p className="text-muted-foreground text-sm mt-1">Basic plan</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-orange-500" /> Max 3 active items</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-orange-500" /> Order management</li>
            </ul>
          </CardContent>
        </Card>
        <Card className="border-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Premium</h2>
              {isPremium && <Badge className="bg-orange-500">Active</Badge>}
            </div>
            <p className="text-muted-foreground text-sm mt-1">$9.99 / 30 days</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-orange-500" /> Unlimited active items</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-orange-500" /> Premium badge</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-orange-500" /> Featured placement</li>
            </ul>
            {!isPremium && (
              <Button className="w-full mt-6" onClick={upgrade} disabled={loading}>
                {loading ? "Redirecting..." : "Upgrade to Premium"}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}