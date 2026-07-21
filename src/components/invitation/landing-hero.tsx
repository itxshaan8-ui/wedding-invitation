"use client";

import { motion, useReducedMotion } from "framer-motion";

import { FloralBackground } from "@/components/invitation/floral-background";
import { Button } from "@/components/ui/button";
import { weddingConfig } from "@/config/wedding";

interface LandingHeroProps {
  onOpen: () => void;
}

export function LandingHero({ onOpen }: LandingHeroProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      className="relative flex min-h-dvh items-center justify-center overflow-hidden px-5"
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={
        reduceMotion
          ? { opacity: 0 }
          : { opacity: 0, y: -40, filter: "blur(6px)" }
      }
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Wedding invitation cover"
    >
      <FloralBackground />

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        <motion.p
          className="mb-6 text-xs font-medium tracking-[0.35em] text-gold-deep uppercase sm:text-sm"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          Together with their families
        </motion.p>

        <motion.h1
          className="font-heading text-[clamp(2.75rem,10vw,5.5rem)] leading-[1.05] text-ink"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8 }}
        >
          <span className="block">{weddingConfig.bride}</span>
          <span className="my-2 block font-sans text-lg font-light tracking-[0.4em] text-gold-deep sm:text-xl">
            &
          </span>
          <span className="block">{weddingConfig.groom}</span>
        </motion.h1>

        <motion.p
          className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.7 }}
        >
          {weddingConfig.tagline}
        </motion.p>

        <motion.div
          className="mt-10"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.7 }}
        >
          <Button
            size="lg"
            onClick={onOpen}
            className="h-12 rounded-full border border-gold/40 bg-gradient-to-r from-gold-deep via-gold to-gold-soft px-8 text-sm font-medium tracking-[0.18em] text-primary-foreground uppercase shadow-[0_12px_30px_rgba(139,111,58,0.28)] transition-transform duration-300 hover:scale-[1.03] hover:brightness-105"
          >
            Open Invitation
          </Button>
        </motion.div>
      </div>
    </motion.section>
  );
}
