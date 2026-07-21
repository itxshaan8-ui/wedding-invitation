import { Mail, MessageCircle, Phone } from "lucide-react";

import { AnimateIn } from "@/components/invitation/animate-in";
import { GlassCard, SectionHeading } from "@/components/invitation/section-heading";
import type { ContactInfo } from "@/types/wedding";

const iconByType = {
  phone: Phone,
  email: Mail,
  whatsapp: MessageCircle,
} as const;

interface ContactSectionProps {
  contacts: ContactInfo[];
}

export function ContactSection({ contacts }: ContactSectionProps) {
  return (
    <section id="contact" className="section-padding" aria-labelledby="contact-heading">
      <SectionHeading
        eyebrow="Get in Touch"
        title="Contact"
        description="Questions about the day, travel, or accommodations? We would love to hear from you."
      />

      <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
        {contacts.map((contact, index) => {
          const Icon = iconByType[contact.type];

          return (
            <AnimateIn key={`${contact.label}-${contact.value}`} delay={index * 0.06}>
              <GlassCard className="h-full transition-transform duration-300 hover:-translate-y-1">
                <a
                  href={contact.href}
                  className="flex items-start gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  target={contact.type === "whatsapp" ? "_blank" : undefined}
                  rel={contact.type === "whatsapp" ? "noopener noreferrer" : undefined}
                >
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-gold/25 bg-gold/10 text-gold-deep">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-xs font-medium tracking-[0.2em] text-gold-deep uppercase">
                      {contact.label}
                    </span>
                    <span
                      id={index === 0 ? "contact-heading" : undefined}
                      className="mt-1 block font-heading text-xl text-ink"
                    >
                      {contact.value}
                    </span>
                  </span>
                </a>
              </GlassCard>
            </AnimateIn>
          );
        })}
      </div>
    </section>
  );
}
