import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="text-6xl font-bold text-orange-500">404</h1>
      <p className="text-xl font-semibold mt-3">Page not found</p>
      <p className="text-muted-foreground mt-1">The page you're looking for doesn't exist.</p>
      <Link href="/"><Button className="mt-6">Back home</Button></Link>
    </div>
  );
}