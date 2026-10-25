type Props = { data: Record<string, string>; labels?: Record<string, string> };

/** Compact key/value rendering of customer data attached to a line. */
export function CustomerDataList({ data, labels = {} }: Props) {
  const entries = Object.entries(data).filter(([k]) => !k.startsWith("_"));
  if (entries.length === 0) return null;
  return (
    <dl className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
      {entries.map(([k, v]) => (
        <div key={k} className="flex gap-1">
          <dt>{labels[k] ?? k.replace(/_/g, " ")}:</dt>
          <dd className="max-w-48 truncate font-medium text-foreground">{/pass|pin/i.test(k) ? "••••••" : v}</dd>
        </div>
      ))}
    </dl>
  );
}
