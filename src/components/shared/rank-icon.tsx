import { Medal } from "lucide-react";
import { cn } from "@/lib/utils";

/** Point Blank rank icon; falls back to a medal glyph when the rank has no image. */
export function RankIcon({ rank, className }: { rank: { name: string; image_url: string }; className?: string }) {
  if (rank.image_url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={rank.image_url} alt={`Pangkat ${rank.name}`} title={rank.name} loading="lazy" className={cn("size-6 shrink-0 object-contain", className)} />;
  }
  return (
    <span title={rank.name} className={cn("grid size-6 shrink-0 place-items-center rounded-md bg-amber-500/15 text-amber-500", className)}>
      <Medal className="size-[60%]" />
    </span>
  );
}
