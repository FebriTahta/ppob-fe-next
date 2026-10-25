"use client";

import { useEffect, useState } from "react";

export type Countdown = { days: number; hours: number; minutes: number; seconds: number; done: boolean };

const calc = (target: number): Countdown => {
  const diff = Math.max(0, target - Date.now());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    done: diff === 0,
  };
};

/** Ticking countdown. Returns null until mounted to avoid hydration mismatches. */
export function useCountdown(iso: string) {
  const target = new Date(iso).getTime();
  const [state, setState] = useState<Countdown | null>(null);
  useEffect(() => {
    const tick = () => setState(calc(target));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return state;
}
