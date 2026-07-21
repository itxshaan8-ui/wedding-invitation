"use client";

import { MapPin, Navigation } from "lucide-react";

import { AnimateIn } from "@/components/invitation/animate-in";
import { GlassCard, SectionHeading } from "@/components/invitation/section-heading";
import { buttonVariants } from "@/components/ui/button";
import type { WeddingConfig } from "@/types/wedding";
import { cn } from "@/lib/utils";

interface VenueSectionProps {
  venue: WeddingConfig["venue"];
}

export function VenueSection({ venue }: VenueSectionProps) {
  return (
    <section id="venue" className="section-padding" aria-labelledby="venue-heading">
      <SectionHeading
        eyebrow="Location"
        title="Venue"
        description="Join us for an evening of love surrounded by gardens, candlelight, and celebration."
      />

      <AnimateIn>
        <GlassCard className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold-deep">
            <MapPin className="size-6" aria-hidden="true" />
          </div>
          <h3 id="venue-heading" className="font-heading text-3xl text-ink sm:text-4xl">
            {venue.name}
          </h3>
          <p className="mt-3 text-base text-muted-foreground">
            {venue.address}
            <br />
            {venue.city}
          </p>
          <a
            href={venue.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${venue.name} in Google Maps`}
            className={cn(
              buttonVariants({ size: "lg" }),
              "mt-8 inline-flex h-11 items-center gap-2 rounded-full border border-gold/35 bg-gradient-to-r from-gold-deep to-gold px-6 tracking-wide text-primary-foreground shadow-md transition-transform hover:scale-[1.03]"
            )}
          >
            <Navigation className="size-4" aria-hidden="true" />
            Open in Google Maps
          </a>
        </GlassCard>
      </AnimateIn>
    </section>
  );
}
