"use client";

import { CopyButton } from "@/components/shared/copy-button";
import { useMounted } from "@/hooks/use-mounted";

/** Displays the callback URL to register at the provider dashboard. */
export function WebhookUrl({ path }: { path: string }) {
  const mounted = useMounted();
  const url = `${mounted ? window.location.origin : ""}${path}`;
  return (
    <div className="flex items-center gap-1 rounded-lg bg-muted/50 px-2 py-1">
      <code className="truncate text-[11px]">{url}</code>
      <CopyButton value={url} label="URL webhook disalin" />
    </div>
  );
}
