export default function Spinner({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="w-72 shrink-0 animate-pulse rounded-2xl bg-white p-4 shadow-soft">
      <div className="h-40 w-full rounded-xl bg-charcoal/10" />
      <div className="mt-4 h-4 w-3/4 rounded bg-charcoal/10" />
      <div className="mt-2 h-3 w-full rounded bg-charcoal/10" />
      <div className="mt-2 h-3 w-5/6 rounded bg-charcoal/10" />
    </div>
  );
}
