"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Loader, EmptyState } from "@/components/shared/Loader";
import type { Transaction } from "@/types";

export default function AdminTransactions() {
  const [tx, setTx] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<Transaction[]>("/transactions").then(setTx).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Transactions</h1>
      {tx.length === 0 ? <EmptyState title="No transactions yet" /> : (
        <div className="space-y-2">
          {tx.map((t) => {
            const v = typeof t.vendorId === "object" ? t.vendorId : null;
            return (
              <div key={t._id} className="flex items-center justify-between gap-3 rounded-lg border p-4">
                <div>
                  <p className="font-medium">{v?.businessName || v?.name}</p>
                  <p className="text-sm text-muted-foreground">{v?.email}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(t.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${(t.amount / 100).toFixed(2)}</p>
                  <Badge variant="outline" className="capitalize">{t.status}</Badge>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}