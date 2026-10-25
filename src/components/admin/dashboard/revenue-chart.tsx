"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { formatRupiah } from "@/lib/format";

type Point = { date: string; revenue: number; profit: number; orders: number };

const config = {
  revenue: { label: "Pendapatan", color: "var(--chart-1)" },
  profit: { label: "Profit", color: "var(--chart-2)" },
} satisfies ChartConfig;

const short = new Intl.NumberFormat("id-ID", { notation: "compact", maximumFractionDigits: 1 });

export function RevenueChart({ data }: { data: Point[] }) {
  return (
    <ChartContainer config={config} className="h-64 w-full">
      <AreaChart data={data} margin={{ left: 4, right: 8, top: 8 }}>
        <defs>
          {(["revenue", "profit"] as const).map((k) => (
            <linearGradient key={k} id={`fill-${k}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={`var(--color-${k})`} stopOpacity={0.5} />
              <stop offset="95%" stopColor={`var(--color-${k})`} stopOpacity={0.02} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(d: string) => d.slice(8, 10) + "/" + d.slice(5, 7)} />
        <YAxis tickLine={false} axisLine={false} width={48} tickFormatter={(v: number) => short.format(v)} />
        <ChartTooltip content={<ChartTooltipContent formatter={(v, name) => <span className="flex w-full justify-between gap-4"><span>{config[name as keyof typeof config]?.label}</span><span className="font-mono font-semibold">{formatRupiah(Number(v))}</span></span>} />} />
        <Area dataKey="revenue" type="monotone" stroke="var(--color-revenue)" fill="url(#fill-revenue)" strokeWidth={2} />
        <Area dataKey="profit" type="monotone" stroke="var(--color-profit)" fill="url(#fill-profit)" strokeWidth={2} />
      </AreaChart>
    </ChartContainer>
  );
}
