"use client";

import { AnimatePresence, motion } from "framer-motion";

import { useCountdown } from "@/hooks/use-countdown";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  targetTimestamp: number;
  className?: string;
}

function CountdownUnit({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  const padded = String(value).padStart(2, "0");

  return (
    <div className="glass flex min-w-[4.5rem] flex-col items-center rounded-2xl px-3 py-4 sm:min-w-[5.5rem] sm:px-4 sm:py-5">
      <div className="relative flex h-10 items-center justify-center overflow-hidden sm:h-12">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={padded}
            className="font-heading block text-3xl leading-none text-ink sm:text-4xl"
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -14, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden="true"
          >
            {padded}
          </motion.span>
        </AnimatePresence>
        <span className="sr-only">
          {value} {label}
        </span>
      </div>
      <span className="mt-2 text-[0.65rem] font-medium tracking-[0.22em] text-muted-foreground uppercase">
        {label}
      </span>
    </div>
  );
}

export function CountdownTimer({
  targetTimestamp,
  className,
}: CountdownTimerProps) {
  const { days, hours, minutes, seconds, isComplete } =
    useCountdown(targetTimestamp);

  if (isComplete) {
    return (
      <p
        className={cn(
          "font-heading text-center text-2xl text-gold-deep sm:text-3xl",
          className
        )}
      >
        The celebration has begun
      </p>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-3 sm:gap-4",
        className
      )}
      role="timer"
      aria-live="polite"
      aria-atomic="true"
    >
      <CountdownUnit value={days} label="Days" />
      <CountdownUnit value={hours} label="Hours" />
      <CountdownUnit value={minutes} label="Minutes" />
      <CountdownUnit value={seconds} label="Seconds" />
    </div>
  );
}
