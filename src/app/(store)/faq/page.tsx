import type { Metadata } from "next";
import { HelpCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getFaqs } from "@/lib/api/server";
import type { FAQ } from "@/lib/types";

export const metadata: Metadata = { title: "FAQ" };

export default async function FaqPage() {
  const faqs = await getFaqs();
  const groups = faqs.reduce<Record<string, FAQ[]>>((acc, f) => {
    (acc[f.category] ??= []).push(f);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-3xl space-y-8 py-6">
      <div className="text-center">
        <div className="mx-auto mb-3 grid size-12 place-items-center rounded-2xl bg-brand-gradient text-white glow">
          <HelpCircle />
        </div>
        <h1 className="text-3xl font-bold">Pertanyaan Umum</h1>
        <p className="mt-1 text-sm text-muted-foreground">Temukan jawaban seputar top up, pembayaran & pesanan.</p>
      </div>
      {Object.entries(groups).map(([cat, items]) => (
        <section key={cat}>
          <h2 className="mb-2 text-sm font-semibold tracking-wide text-primary uppercase">{cat}</h2>
          <Accordion type="single" collapsible className="glass rounded-2xl px-4">
            {items.map((f) => (
              <AccordionItem key={f.id} value={String(f.id)}>
                <AccordionTrigger className="text-left">{f.question}</AccordionTrigger>
                <AccordionContent className="whitespace-pre-line text-muted-foreground">{f.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      ))}
    </div>
  );
}
