import { cn } from "@/lib/utils";

type Props = { step: number; title: string; description?: string; children: React.ReactNode; className?: string; aside?: React.ReactNode };

/** Numbered purchase step container. */
export function StepCard({ step, title, description, children, className, aside }: Props) {
  return (
    <section className={cn("glass rounded-2xl p-4 sm:p-5", className)}>
      <header className="mb-4 flex items-center gap-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-gradient font-heading text-sm font-bold text-white">{step}</span>
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold">{title}</h2>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
        {aside}
      </header>
      {children}
    </section>
  );
}
