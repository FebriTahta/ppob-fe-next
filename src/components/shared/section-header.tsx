import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  title: React.ReactNode;
  subtitle?: string;
  icon?: React.ReactNode;
  href?: string;
  action?: React.ReactNode;
  className?: string;
};

export function SectionHeader({ title, subtitle, icon, href, action, className }: Props) {
  return (
    <div className={cn("mb-4 flex items-end justify-between gap-4", className)}>
      <div className="flex items-center gap-3">
        {icon && <div className="grid size-10 place-items-center rounded-xl bg-brand-gradient text-white shadow-lg glow">{icon}</div>}
        <div>
          <h2 className="text-xl font-bold sm:text-2xl">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {action}
      {href && !action && (
        <Link href={href} className="flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline">
          Lihat semua <ChevronRight className="size-4" />
        </Link>
      )}
    </div>
  );
}
