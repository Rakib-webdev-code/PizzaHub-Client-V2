import Link from "next/link";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

export default function PaymentCancel() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <XCircle className="h-16 w-16 mx-auto text-red-500" />
      <h1 className="text-2xl font-bold mt-4">Payment cancelled</h1>
      <p className="text-muted-foreground mt-2">No charges were made. You can try again anytime.</p>
      <Link href="/dashboard/vendor/subscription"><Button className="mt-6">Back to Subscription</Button></Link>
    </div>
  );
}