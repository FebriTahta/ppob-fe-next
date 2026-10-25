import { Headset, MessageCircle, Phone, Send } from "lucide-react";
import { WhatsappIcon } from "@/components/shared/whatsapp-icon";
import { whatsappLink } from "@/lib/format";
import type { ContactSettings } from "@/lib/types";
import { cn } from "@/lib/utils";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  whatsapp: WhatsappIcon,
  headset: Headset,
  chat: MessageCircle,
  phone: Phone,
  send: Send,
};

/** Floating "contact admin" button. Icon, color, label & position are configured from the admin panel. */
export function FloatingContact({ contact }: { contact: ContactSettings }) {
  if (!contact.floating_enabled || !contact.whatsapp_number) return null;
  const Icon = ICONS[contact.floating_icon] ?? WhatsappIcon;
  const color = contact.floating_color || "#22c55e";

  return (
    <a
      href={whatsappLink(contact.whatsapp_number, contact.whatsapp_message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={contact.floating_label || "Hubungi admin via WhatsApp"}
      className={cn(
        "floating-contact group fixed bottom-24 z-50 flex items-center gap-2 transition-[bottom] sm:bottom-6",
        contact.floating_position === "left" ? "left-4 flex-row-reverse" : "right-4",
      )}
      style={{ "--wa-color": color } as React.CSSProperties}
    >
      {contact.floating_label && (
        <span className="glass hidden rounded-full px-3 py-1.5 text-xs font-semibold shadow-lg transition-all group-hover:scale-105 md:block">
          {contact.floating_label}
        </span>
      )}
      <span
        className="grid size-14 place-items-center rounded-full text-white shadow-xl animate-pulse-ring transition-transform group-hover:scale-110"
        style={{ backgroundColor: color }}
      >
        {contact.floating_icon_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={contact.floating_icon_url} alt="" className="size-8 object-contain" />
        ) : (
          <Icon className="size-7" />
        )}
      </span>
    </a>
  );
}
