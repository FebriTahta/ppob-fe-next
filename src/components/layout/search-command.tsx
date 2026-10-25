"use client";

import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GameArt } from "@/components/shared/game-art";
import { Button } from "@/components/ui/button";
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Kbd } from "@/components/ui/kbd";
import { useDebounce } from "@/hooks/use-debounce";
import { api } from "@/lib/api/client";
import { categoryTypeLabel } from "@/lib/constants";
import type { Category } from "@/lib/types";

/** Global game search (⌘K / Ctrl+K). */
export function SearchCommand() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const term = useDebounce(q, 250);
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const { data = [], isFetching } = useQuery({
    queryKey: ["search", term],
    queryFn: ({ signal }) => api.get<Category[]>("/categories", { q: term, limit: 12 }, signal),
    enabled: open,
    staleTime: 60_000,
  });

  const go = (slug: string) => {
    setOpen(false);
    setQ("");
    router.push(`/game/${slug}`);
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="h-9 gap-2 rounded-full bg-muted/40 px-3 text-muted-foreground md:w-56 md:justify-start"
        aria-label="Cari game"
      >
        <Search />
        <span className="hidden md:inline">Cari game...</span>
        <Kbd className="ml-auto hidden md:inline-flex">⌘K</Kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen} title="Cari game" description="Cari game atau produk">
        <Command shouldFilter={false}>
        <CommandInput placeholder="Cari Mobile Legends, Free Fire, Voucher..." value={q} onValueChange={setQ} />
        <CommandList>
          <CommandEmpty>{isFetching ? "Mencari..." : "Game tidak ditemukan."}</CommandEmpty>
          {data.length > 0 && (
            <CommandGroup heading={term ? "Hasil pencarian" : "Rekomendasi"}>
              {data.map((c) => (
                <CommandItem key={c.id} value={c.slug} onSelect={() => go(c.slug)} className="gap-3">
                  <div className="size-9 shrink-0 overflow-hidden rounded-lg">
                    <GameArt name={c.name} src={c.image_url} textClassName="text-xs" />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate font-medium">{c.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {c.publisher} · {categoryTypeLabel(c.type)}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
