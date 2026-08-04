"use client";

import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"] as const;
const YEAR = 2026;
const MONTH_INDEX = 9;
const HIGHLIGHT_DAY = 24;
const MONTH_LABEL = "October";
const COLS = 7;

function buildOctoberCells() {
  const firstWeekday = new Date(YEAR, MONTH_INDEX, 1).getDay();
  const daysInMonth = new Date(YEAR, MONTH_INDEX + 1, 0).getDate();
  const cells: Array<number | null> = Array.from(
    { length: firstWeekday },
    () => null
  );

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(day);
  }

  while (cells.length % COLS !== 0) {
    cells.push(null);
  }

  return cells;
}

function sketchRotate(day: number) {
  return ((day * 17) % 7) - 3;
}

function SketchGridLines({ rows }: { rows: number }) {
  const width = 280;
  const height = rows * 42;
  const verticals = Array.from({ length: COLS - 1 }, (_, index) => {
    const x = ((index + 1) / COLS) * width;
    const wobble = ((index * 13) % 5) - 2;
    return `M${x + wobble * 0.15} 2 C ${x + 1.2} ${height * 0.28}, ${x - 1.1} ${height * 0.62}, ${x + wobble * 0.1} ${height - 2}`;
  });
  const horizontals = Array.from({ length: rows - 1 }, (_, index) => {
    const y = ((index + 1) / rows) * height;
    const wobble = ((index * 11) % 5) - 2;
    return `M2 ${y + wobble * 0.12} C ${width * 0.3} ${y - 1.1}, ${width * 0.68} ${y + 1.2}, ${width - 2} ${y + wobble * 0.08}`;
  });

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      preserveAspectRatio="none"
    >
      {verticals.map((d, index) => (
        <path
          key={`v-${index}`}
          d={d}
          className="stroke-gold-deep/45"
          strokeWidth="1.15"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {horizontals.map((d, index) => (
        <path
          key={`h-${index}`}
          d={d}
          className="stroke-gold-deep/45"
          strokeWidth="1.15"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

function SketchHeart({
  delay = 0,
  reduceMotion = false,
}: {
  delay?: number;
  reduceMotion?: boolean | null;
}) {
  const drawDuration = 1.45;
  const drawEase = [0.4, 0.05, 0.2, 1] as const;

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 size-[3.15rem] -translate-x-1/2 -translate-y-1/2 overflow-visible sm:size-[3.45rem]"
      viewBox="0 0 100 100"
      fill="none"
    >
      <motion.path
        d="M50 36
           C 47 26, 41 18, 33 17
           C 22 15, 13 22, 12 34
           C 11 44, 18 53, 26 61
           C 34 70, 44 78, 50 86
           C 56 78, 67 69, 75 60
           C 84 51, 90 42, 88 32
           C 86 20, 76 15, 67 17
           C 58 19, 53 27, 50 36 Z"
        stroke="#b71c1c"
        strokeWidth="4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduceMotion ? false : { pathLength: 0, opacity: 0.85 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: drawDuration, delay, ease: drawEase }
        }
      />
      <motion.path
        d="M50 38
           C 46 28, 39 21, 31 20
           C 22 19, 16 26, 16 35
           C 16 45, 23 54, 31 63
           C 38 71, 46 78, 50 84
           C 55 77, 64 70, 72 61
           C 80 53, 86 44, 85 34
           C 84 24, 75 19, 66 20
           C 58 21, 53 29, 50 38 Z"
        stroke="#e53935"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity={0.9}
        initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.95 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : {
                duration: drawDuration * 0.92,
                delay: delay + 0.12,
                ease: drawEase,
              }
        }
      />
      <motion.path
        d="M34 24
           C 28 26, 24 32, 24 38
           C 24 46, 30 54, 38 62"
        stroke="#7f1010"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeOpacity={0.55}
        initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.6 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : {
                duration: 0.55,
                delay: delay + drawDuration * 0.35,
                ease: "easeOut",
              }
        }
      />
      <motion.path
        d="M28 28 C 32 24, 38 23, 42 26"
        stroke="#ff8a80"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeOpacity={0.75}
        initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.8 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : {
                duration: 0.35,
                delay: delay + drawDuration * 0.55,
                ease: "easeOut",
              }
        }
      />
    </svg>
  );
}

interface WeddingCalendarProps {
  className?: string;
  revealDelay?: number;
}

export function WeddingCalendar({
  className,
  revealDelay = 0,
}: WeddingCalendarProps) {
  const reduceMotion = useReducedMotion();
  const cells = buildOctoberCells();
  const instant = Boolean(reduceMotion) || revealDelay <= 0;
  const delay = instant ? 0 : revealDelay;
  const rowCount = 1 + cells.length / COLS;

  return (
    <motion.div
      className={cn("relative z-10 mx-auto w-full max-w-[24rem]", className)}
      initial={instant ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: instant ? 0 : 0.55,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div
        className="relative px-1.5 pb-4 pt-4 sm:px-2 sm:pb-5 sm:pt-5"
        aria-label={`Calendar for ${MONTH_LABEL} ${YEAR}, wedding day highlighted`}
      >
        <p className="font-sketch relative text-center text-[1.95rem] font-bold leading-none text-gold-deep sm:text-[2.25rem]">
          <span
            className="inline-block"
            style={{ transform: "rotate(-1.5deg)" }}
          >
            {MONTH_LABEL}
          </span>
        </p>
        <p
          className="font-sketch relative mt-1 text-center text-base font-bold tracking-[0.18em] text-gold-deep"
          style={{ transform: "rotate(0.8deg)" }}
        >
          {YEAR}
        </p>

        <div className="relative mt-5">
          <SketchGridLines rows={rowCount} />

          <div className="relative grid grid-cols-7 text-center">
            {WEEKDAYS.map((label, index) => (
              <span
                key={`weekday-${index}`}
                className="font-sketch flex h-10 items-center justify-center text-base font-bold text-gold-deep sm:h-11 sm:text-lg"
                style={{ transform: `rotate(${(index % 3) - 1}deg)` }}
              >
                {label}
              </span>
            ))}

            {cells.map((day, index) => {
              if (day === null) {
                return (
                  <span key={`empty-${index}`} className="h-10 sm:h-11" />
                );
              }

              const isWeddingDay = day === HIGHLIGHT_DAY;

              return (
                <span
                  key={day}
                  className={cn(
                    "font-sketch relative flex h-10 items-center justify-center text-xl font-bold leading-none text-gold-deep sm:h-11 sm:text-2xl",
                    isWeddingDay && "z-10 font-extrabold"
                  )}
                  style={
                    isWeddingDay
                      ? undefined
                      : { transform: `rotate(${sketchRotate(day)}deg)` }
                  }
                >
                  {isWeddingDay ? (
                    <SketchHeart
                      delay={delay + 0.55}
                      reduceMotion={reduceMotion}
                    />
                  ) : null}
                  <span className="relative z-10 flex size-full items-center justify-center">
                    {day}
                  </span>
                  {isWeddingDay ? (
                    <span className="sr-only">Wedding day</span>
                  ) : null}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
