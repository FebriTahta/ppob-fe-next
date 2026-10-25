"use client";

import { useState } from "react";
import { ActiveDot, Pill } from "@/components/admin/cells";
import { CrudPage } from "@/components/admin/crud-page";
import { useOptions } from "@/components/admin/use-options";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { formatDateTime } from "@/lib/format";
import type { MembershipLevel, User } from "@/lib/types";

export default function UsersPage() {
  const levels = useOptions<MembershipLevel>("/admin/membership-levels", (l) => `${l.name} (${l.kind})`);
  const levelName = (id: number | null) => levels.find((l) => l.value === String(id))?.label;
  const [q, setQ] = useState("");
  const search = useDebounce(q);
  return (
    <CrudPage<User>
      title="Pengguna"
      description="Atur role admin, level membership/reseller, dan status akun."
      singular="Pengguna"
      endpoint="/admin/users"
      paginated
      canCreate={false}
      canDelete={false}
      query={{ q: search }}
      toolbar={<Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari nama, email, HP…" className="h-9 w-64" />}
      defaults={{}}
      toForm={(u) => ({ name: u.name, phone: u.phone, role: u.role, membership_level_id: u.membership_level_id, is_active: u.is_active })}
      fields={[
        { name: "name", label: "Nama", type: "text", required: true },
        { name: "phone", label: "No. HP", type: "text" },
        { name: "role", label: "Role", type: "select", options: [{ value: "customer", label: "Customer" }, { value: "admin", label: "Admin" }] },
        { name: "membership_level_id", label: "Level membership", type: "select", options: levels, numeric: true, nullable: true, placeholder: "Reguler" },
        { name: "is_active", label: "Akun aktif", type: "switch" },
      ]}
      columns={[
        { header: "Pengguna", cell: (u) => <div><p className="font-semibold">{u.name}</p><p className="text-xs text-muted-foreground">{u.email} · {u.phone}</p></div> },
        { header: "Role", cell: (u) => <Pill className={u.role === "admin" ? "bg-primary/15 text-primary" : ""}>{u.role}</Pill> },
        { header: "Level", cell: (u) => levelName(u.membership_level_id) ?? <span className="text-muted-foreground">Reguler</span> },
        { header: "Terdaftar", cell: (u) => <span className="text-xs">{formatDateTime(u.created_at)}</span> },
        { header: "Status", cell: (u) => <ActiveDot active={u.is_active} /> },
      ]}
    />
  );
}
