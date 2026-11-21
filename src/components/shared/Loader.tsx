export function Loader({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex items-center justify-center py-16 text-muted-foreground">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-orange-500 border-t-transparent mr-3" />
      {label}
    </div>
  );
}

export function EmptyState({ title = "Nothing here", hint }: { title?: string; hint?: string }) {
  return (
    <div className="rounded-lg border border-dashed p-10 text-center">
      <p className="font-medium">{title}</p>
      {hint && <p className="text-sm text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
}