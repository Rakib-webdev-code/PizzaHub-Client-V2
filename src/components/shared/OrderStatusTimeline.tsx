import type { OrderStatus } from "@/types";

const STEPS: OrderStatus[] = ["pending", "accepted", "cancelled"];

export function OrderStatusTimeline({ status }: { status: OrderStatus }) {
  const isCancelled = status === "cancelled" || status === "rejected";
  const idx = isCancelled ? 0 : STEPS.indexOf(status);

  return (
    <div className="flex items-center gap-2 my-3">
      {STEPS.map((s, i) => {
        const active = !isCancelled && i <= idx;
        return (
          <div key={s} className="flex items-center">
            <div className={`h-3 w-3 rounded-full ${active ? "bg-orange-500" : "bg-gray-300 dark:bg-gray-600"}`} />
            {i < STEPS.length - 1 && (
              <div className={`h-0.5 w-10 ${active ? "bg-orange-500" : "bg-gray-300 dark:bg-gray-600"}`} />
            )}
          </div>
        );
      })}
      <span className="ml-3 text-sm capitalize font-medium">{status}</span>
    </div>
  );
}