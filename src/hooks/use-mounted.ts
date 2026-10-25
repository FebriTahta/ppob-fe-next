"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** True only on the client after hydration (for persisted stores like the cart). */
export function useMounted() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
