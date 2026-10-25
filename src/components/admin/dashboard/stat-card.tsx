import { cn } from "@/lib/utils";

type Props = { label: string; value: string; hint?: string; icon: React.ReactNode; accent?: string };

export function StatCard({ label, value, hint, icon, accent = "from-violet-500 to-cyan-400" }: Props) {
  return (
    <div className="glass relative overflow-hidden rounded-2xl p-4">
      <div className={cn("absolute -top-8 -right-8 size-24 rounded-full bg-gradient-to-br opacity-20 blur-xl", accent)} />
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <span className={cn("grid size-8 place-items-center rounded-lg bg-gradient-to-br text-white", accent)}>{icon}</span>
      </div>
      <p className="mt-2 font-heading text-2xl font-bold tabular-nums">{value}</p>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
