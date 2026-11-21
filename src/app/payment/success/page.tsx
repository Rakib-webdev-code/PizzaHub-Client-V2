"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { Loader } from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface S { status: string; amount: number; currency: string; }

export default function PaymentSuccess() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const [state, setState] = useState<S | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) { setLoading(false); return; }
    api<S>(`/stripe/session/${sessionId}`).then(setState).catch(() => {}).finally(() => setLoading(false));
  }, [sessionId]);

  if (loading) return <Loader />;

  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <CheckCircle2 className="h-16 w-16 mx-auto text-green-500" />
      <h1 className="text-2xl font-bold mt-4">Payment successful</h1>
      <p className="text-muted-foreground mt-2">
        {state?.status === "paid"
          ? `Thank you! Your premium subscription is now active.`
          : "Your payment is being processed. Premium will activate shortly via webhook."}
      </p>
      <Link href="/dashboard/vendor/subscription"><Button className="mt-6">Back to Subscription</Button></Link>
    </div>
  );
}