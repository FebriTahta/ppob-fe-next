"use server";

import { updateTag } from "next/cache";
import { cookies } from "next/headers";
import { API_URL, type CacheTagName } from "@/lib/tags";

async function isAdmin() {
  const token = (await cookies()).get("ppob_token")?.value;
  if (!token) return false;
  try {
    const res = await fetch(`${API_URL}/api/v1/me`, { headers: { Authorization: `Bearer ${token}` } });
    const json = await res.json();
    return json?.data?.role === "admin";
  } catch {
    return false;
  }
}

/** Expires cached storefront data after an admin mutation so changes are visible immediately. */
export async function revalidateStorefront(tags: CacheTagName[]) {
  if (!(await isAdmin())) return;
  for (const t of tags) updateTag(t);
}
