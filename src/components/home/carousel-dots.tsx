import { cn } from "@/lib/utils";

type Props = { count: number; active: number; onSelect: (i: number) => void; className?: string };

export function CarouselDots({ count, active, onSelect, className }: Props) {
  return (
    <div className={cn("flex items-center justify-center gap-1.5", className)}>
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Slide ${i + 1}`}
          onClick={() => onSelect(i)}
          className={cn(
            "h-1.5 rounded-full transition-all duration-300",
            i === active ? "w-7 bg-brand-gradient" : "w-1.5 bg-foreground/25 hover:bg-foreground/50",
          )}
        />
      ))}
    </div>
  );
}
