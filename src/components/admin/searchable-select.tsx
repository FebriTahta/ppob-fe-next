"use client";

import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { Option } from "./schema-form";

type Props = {
  id?: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  placeholder?: string;
  /** Shown as the first option and selected when value is empty (nullable fields). */
  noneLabel?: string;
  noneValue?: string;
};

/** Select with a search box for long option lists (e.g. categories). */
export function SearchableSelect({ id, value, options, onChange, placeholder = "Pilih", noneLabel, noneValue = "" }: Props) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value);
  const label = current?.label ?? (noneLabel && value === noneValue ? `— ${noneLabel} —` : undefined);

  const pick = (v: string) => {
    onChange(v);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("h-9 w-full justify-between px-3 font-normal", !label && "text-muted-foreground")}
        >
          <span className="flex min-w-0 items-center gap-2">
            {current?.icon}
            <span className="truncate">{label ?? placeholder}</span>
          </span>
          <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) min-w-56 p-0" align="start">
        <Command>
          <CommandInput placeholder="Cari…" />
          {/* The popover is portalled outside the modal dialog, whose scroll lock would swallow wheel/touch scrolling. */}
          <CommandList className="max-h-64" onWheel={(e) => e.stopPropagation()} onTouchMove={(e) => e.stopPropagation()}>
            <CommandEmpty>Tidak ditemukan.</CommandEmpty>
            <CommandGroup>
              {noneLabel && (
                <CommandItem value={`__none ${noneLabel}`} data-checked={value === noneValue} onSelect={() => pick(noneValue)}>
                  — {noneLabel} —
                </CommandItem>
              )}
              {options.map((o) => (
                // cmdk filters on `value`; the id suffix keeps items with the same label distinct.
                <CommandItem key={o.value} value={`${o.label} #${o.value}`} data-checked={o.value === value} onSelect={() => pick(o.value)}>
                  {o.icon}
                  {o.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
