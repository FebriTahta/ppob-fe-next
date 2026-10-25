import { cn } from "@/lib/utils";
import { initials } from "@/lib/format";

const GRADIENTS = [
  "from-violet-600 via-fuchsia-500 to-cyan-400",
  "from-sky-600 via-blue-500 to-indigo-500",
  "from-orange-500 via-rose-500 to-fuchsia-600",
  "from-emerald-500 via-teal-500 to-cyan-500",
  "from-amber-400 via-orange-500 to-red-500",
  "from-indigo-600 via-purple-600 to-pink-500",
  "from-cyan-500 via-sky-500 to-violet-600",
  "from-lime-500 via-emerald-500 to-teal-600",
];

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

type Props = { name: string; src?: string; className?: string; textClassName?: string };

/** Game/product artwork: uses the uploaded image, otherwise a deterministic neon gradient tile. */
export function GameArt({ name, src, className, textClassName }: Props) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={name} loading="lazy" decoding="async" className={cn("size-full object-cover", className)} />
    );
  }
  const g = GRADIENTS[hash(name) % GRADIENTS.length];
  return (
    <div className={cn("relative grid size-full place-items-center overflow-hidden bg-gradient-to-br", g, className)} aria-label={name}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_45%)]" />
      <div className="absolute -bottom-6 -right-6 size-24 rounded-full border-[10px] border-white/15" />
      <div className="absolute -top-4 -left-4 size-14 rotate-45 rounded-xl border-4 border-white/10" />
      <span className={cn("relative font-heading text-3xl font-bold tracking-tight text-white drop-shadow-lg", textClassName)}>
        {initials(name)}
      </span>
    </div>
  );
}
