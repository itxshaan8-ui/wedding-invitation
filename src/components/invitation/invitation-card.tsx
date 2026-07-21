"use client";

import { CalendarHeart } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { AnimateIn } from "@/components/invitation/animate-in";
import { CountdownTimer } from "@/components/invitation/countdown-timer";
import { GlassCard } from "@/components/invitation/section-heading";
import { weddingConfig } from "@/config/wedding";

export function InvitationCard() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="relative px-5 pb-8 pt-16 sm:pt-20"
      aria-labelledby="couple-heading"
    >
      <motion.div
        className="relative z-10 mx-auto max-w-3xl"
        initial={reduceMotion ? false : { opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <GlassCard className="overflow-hidden px-6 py-12 text-center sm:px-10 sm:py-16 md:px-14">
          <p className="text-sm font-medium tracking-[0.28em] text-gold-deep uppercase sm:text-base">
            The Wedding Ceremony of
          </p>

          <h1
            id="couple-heading"
            className="mt-6 font-heading text-[clamp(2.4rem,8.5vw,4.25rem)] leading-[1.1] text-ink"
          >
            {weddingConfig.groom}
            <span className="mx-3 font-heading text-2xl font-normal text-gold-deep sm:mx-4 sm:text-3xl">
              &
            </span>
            {weddingConfig.bride}
          </h1>

          <div className="mx-auto mt-10 flex max-w-lg flex-col items-center text-muted-foreground">
            <time
              dateTime={new Date(weddingConfig.weddingTimestamp).toISOString()}
              className="text-center"
            >
              <span className="flex items-center justify-center gap-2.5 text-lg sm:text-xl md:text-2xl">
                <CalendarHeart
                  className="size-5 shrink-0 text-gold-deep sm:size-6"
                  aria-hidden="true"
                />
                <span>{weddingConfig.weddingDateLine}</span>
              </span>
              <span className="mt-2 block text-base sm:text-lg md:text-xl">
                {weddingConfig.weddingTimeLine}
              </span>
            </time>
          </div>

          <div className="mx-auto mt-5 h-px w-28 bg-gradient-to-r from-transparent via-gold-soft to-transparent" />

          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            {weddingConfig.tagline} as we begin our forever.
          </p>
        </GlassCard>
      </motion.div>

      <AnimateIn className="relative z-10 mt-12" delay={0.15}>
        <CountdownTimer targetTimestamp={weddingConfig.weddingTimestamp} />
      </AnimateIn>
    </section>
  );
}
