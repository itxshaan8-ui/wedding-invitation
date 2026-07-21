"use client";

import { CalendarHeart } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { AnimateIn } from "@/components/invitation/animate-in";
import { CountdownTimer } from "@/components/invitation/countdown-timer";
import { FloralBackground } from "@/components/invitation/floral-background";
import { GlassCard } from "@/components/invitation/section-heading";
import { weddingConfig } from "@/config/wedding";

export function InvitationCard() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="relative overflow-hidden px-5 pb-8 pt-16 sm:pt-20"
      aria-labelledby="couple-heading"
    >
      <FloralBackground />

      <motion.div
        className="relative z-10 mx-auto max-w-3xl"
        initial={reduceMotion ? false : { opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <GlassCard className="overflow-hidden px-6 py-12 text-center sm:px-12 sm:py-16">
          <p className="text-xs font-medium tracking-[0.32em] text-gold-deep uppercase">
            The wedding of
          </p>

          <h1
            id="couple-heading"
            className="mt-5 font-heading text-[clamp(2.4rem,8vw,4.5rem)] leading-[1.08] text-ink"
          >
            {weddingConfig.bride}
            <span className="mx-3 font-sans text-xl font-light tracking-[0.35em] text-gold-deep sm:text-2xl">
              &
            </span>
            {weddingConfig.groom}
          </h1>

          <div className="mx-auto mt-8 flex max-w-md flex-col items-center gap-3 text-muted-foreground">
            <div className="flex items-center gap-2 text-sm sm:text-base">
              <CalendarHeart className="size-4 text-gold-deep" aria-hidden="true" />
              <time dateTime={weddingConfig.weddingDate}>
                {weddingConfig.weddingDateDisplay}
              </time>
            </div>
            <p className="text-sm sm:text-base">
              {weddingConfig.venue.name}
              <span className="mx-2 text-gold/60">·</span>
              {weddingConfig.venue.city}
            </p>
          </div>

          <div className="mx-auto mt-10 h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent" />

          <p className="mx-auto mt-8 max-w-md text-base leading-relaxed text-muted-foreground">
            {weddingConfig.tagline} as we begin our forever.
          </p>
        </GlassCard>
      </motion.div>

      <AnimateIn className="relative z-10 mt-12" delay={0.15}>
        <CountdownTimer targetDate={weddingConfig.weddingDate} />
      </AnimateIn>
    </section>
  );
}
