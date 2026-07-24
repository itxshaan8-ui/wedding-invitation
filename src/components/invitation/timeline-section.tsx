"use client";

import {
  Camera,
  Heart,
  Music,
  UtensilsCrossed,
  Wine,
  type LucideIcon,
} from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

import { GlassCard, SectionHeading } from "@/components/invitation/section-heading";
import type { TimelineEvent } from "@/types/wedding";

const iconMap: Record<TimelineEvent["icon"], LucideIcon> = {
  ceremony: Heart,
  reception: Wine,
  dinner: UtensilsCrossed,
  party: Music,
  photos: Camera,
};

interface TimelineSectionProps {
  events: TimelineEvent[];
  revealDelay?: number;
}

export function TimelineSection({
  events,
  revealDelay = 0,
}: TimelineSectionProps) {
  const reduceMotion = useReducedMotion();
  const sectionDelay = reduceMotion ? 0 : revealDelay;

  const sectionVariants: Variants = {
    hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: sectionDelay,
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
        when: "beforeChildren",
        delayChildren: 0.08,
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.section
      id="timeline"
      className="section-padding"
      aria-labelledby="timeline-heading"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
    >
      <SectionHeading
        eyebrow="The Day"
        title="Wedding Timeline"
        description="A gentle rhythm for our celebration — arrive early, stay late, and savor every moment."
      />

      <ol className="relative mx-auto max-w-3xl space-y-6">
        <div
          aria-hidden="true"
          className="absolute top-4 bottom-4 left-[1.65rem] w-px bg-gradient-to-b from-gold/10 via-gold/40 to-gold/10 sm:left-1/2 sm:-translate-x-px"
        />

        {events.map((event, index) => {
          const Icon = iconMap[event.icon];
          const isLeft = index % 2 === 0;

          return (
            <motion.li
              key={event.id}
              className="relative grid gap-4 sm:grid-cols-2 sm:gap-10"
              variants={itemVariants}
            >
              <div
                className={`flex items-start gap-4 sm:contents ${
                  isLeft ? "" : "sm:col-start-2"
                }`}
              >
                <span className="relative z-10 flex size-14 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-white/80 text-gold-deep shadow-md sm:absolute sm:left-1/2 sm:-translate-x-1/2">
                  <Icon className="size-5" aria-hidden="true" />
                </span>

                <GlassCard
                  className={`flex-1 ${
                    isLeft ? "sm:col-start-1 sm:text-right" : "sm:col-start-2"
                  }`}
                >
                  <p className="text-xs font-medium tracking-[0.22em] text-gold-deep uppercase">
                    {event.time}
                  </p>
                  <h3
                    id={index === 0 ? "timeline-heading" : undefined}
                    className="mt-2 font-heading text-2xl text-ink"
                  >
                    {event.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {event.description}
                  </p>
                </GlassCard>
              </div>
            </motion.li>
          );
        })}
      </ol>
    </motion.section>
  );
}
