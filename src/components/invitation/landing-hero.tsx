"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

interface LandingHeroProps {
  onOpenStart: () => void | Promise<void>;
  onOpenComplete: () => void;
}

type EnvelopePhase = "idle" | "opening";

const HOLD_DURATION_MS = 1000;
const SHUTTER_DURATION = 1.9;
const SHUTTER_EASE = [0.66, 0.02, 0.28, 1] as const;
const HOLD_FEEDBACK_VIBRATE = [25, 90, 25, 90, 30, 90, 35, 90, 40] as number[];
const OPEN_VIBRATE = [90, 45, 140, 50, 220, 60, 255] as number[];

function vibrate(pattern: number | number[]) {
  if (typeof navigator === "undefined" || !("vibrate" in navigator)) return;
  try {
    navigator.vibrate(pattern);
  } catch {
    /* unsupported */
  }
}

function stopVibrate() {
  vibrate(0);
}

function EnvelopeTexture() {
  return (
    <div className="envelope-royal absolute inset-0 overflow-hidden">
      <div className="envelope-damask absolute inset-0" />
      <div className="envelope-noise absolute inset-0" />
    </div>
  );
}

function EnvelopeCoverThread({ hingeY }: { hingeY: number }) {
  const leftEdge = `0,${hingeY} 50,100`;
  const rightEdge = `100,${hingeY} 50,100`;

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[6] h-full w-full overflow-visible"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <polyline
        fill="none"
        points={leftEdge}
        stroke="rgba(42, 25, 8, 0.4)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        style={{ filter: "blur(4px)" }}
      />
      <polyline
        fill="none"
        points={rightEdge}
        stroke="rgba(42, 25, 8, 0.4)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        style={{ filter: "blur(4px)" }}
      />

      <polyline
        fill="none"
        points={leftEdge}
        stroke="#3d2a12"
        strokeWidth="4.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        opacity={0.95}
      />
      <polyline
        fill="none"
        points={rightEdge}
        stroke="#3d2a12"
        strokeWidth="4.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        opacity={0.95}
      />

      <polyline
        fill="none"
        points={leftEdge}
        stroke="#c4a574"
        strokeWidth="2.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="2.6 1.7"
        vectorEffect="non-scaling-stroke"
        opacity={0.96}
      />
      <polyline
        fill="none"
        points={rightEdge}
        stroke="#c4a574"
        strokeWidth="2.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="2.6 1.7"
        vectorEffect="non-scaling-stroke"
        opacity={0.96}
      />

      <polyline
        fill="none"
        points={leftEdge}
        stroke="#f3e6d2"
        strokeWidth="2.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="2.6 1.7"
        strokeDashoffset="2.15"
        vectorEffect="non-scaling-stroke"
        opacity={0.85}
      />
      <polyline
        fill="none"
        points={rightEdge}
        stroke="#f3e6d2"
        strokeWidth="2.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="2.6 1.7"
        strokeDashoffset="2.15"
        vectorEffect="non-scaling-stroke"
        opacity={0.85}
      />

      <polyline
        fill="none"
        points={leftEdge}
        stroke="#8b5e2b"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="1.15 2.85"
        strokeDashoffset="1.1"
        vectorEffect="non-scaling-stroke"
        opacity={0.92}
      />
      <polyline
        fill="none"
        points={rightEdge}
        stroke="#8b5e2b"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="1.15 2.85"
        strokeDashoffset="1.1"
        vectorEffect="non-scaling-stroke"
        opacity={0.92}
      />

      <polyline
        fill="none"
        points={leftEdge}
        stroke="#fff6e4"
        strokeWidth="0.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        opacity={0.6}
      />
      <polyline
        fill="none"
        points={rightEdge}
        stroke="#fff6e4"
        strokeWidth="0.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        opacity={0.6}
      />
    </svg>
  );
}

function EnvelopeStamp({
  locked,
  holding,
  opening,
  onHoldStart,
  onHoldEnd,
}: {
  locked: boolean;
  holding: boolean;
  opening: boolean;
  onHoldStart: (event: ReactPointerEvent<HTMLButtonElement>) => void;
  onHoldEnd: () => void;
}) {
  return (
    <motion.div
      className="absolute top-[61%] left-1/2 z-40 flex size-[7.25rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center sm:top-[44%] sm:size-[8.75rem]"
      initial={false}
      animate={
        opening
          ? { opacity: 0, scale: 0.72, y: -18 }
          : {
              opacity: 1,
              scale: holding ? 1.08 : [1, 1.03, 1],
              y: 0,
            }
      }
      transition={
        opening
          ? { duration: 0.35, ease: "easeOut" }
          : holding
            ? { duration: 0.2, ease: "easeOut" }
            : {
                scale: { duration: 2.8, repeat: Infinity, ease: "easeInOut" },
              }
      }
    >
      <button
        type="button"
        disabled={locked}
        aria-label="Hold the seal for one second to open the invitation"
        onPointerDown={onHoldStart}
        onPointerUp={onHoldEnd}
        onPointerCancel={onHoldEnd}
        onLostPointerCapture={onHoldEnd}
        onContextMenu={(event) => event.preventDefault()}
        className={`stamp-wax relative flex size-full cursor-pointer items-center justify-center rounded-full border-0 p-0 touch-none select-none transition-transform duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f0d9a8]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:cursor-default ${
          locked ? "" : "hover:scale-[1.05] hover:-rotate-1"
        }`}
        style={{
          filter: "contrast(1.04) saturate(0.95)",
          WebkitTouchCallout: "none",
          WebkitUserSelect: "none",
          userSelect: "none",
        }}
      >
        <div
          aria-hidden="true"
          className="stamp-rope absolute inset-[3px] rounded-full"
        />
        <div
          aria-hidden="true"
          className="absolute inset-[9px] rounded-full border border-[#f0d9a8]/35 opacity-80"
          style={{
            boxShadow:
              "inset 0 0 0 1px rgba(70, 40, 10, 0.35), 0 0 0 1px rgba(255, 220, 160, 0.15)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-[14px] rounded-full"
          style={{
            border: "1.5px dashed rgba(255, 230, 190, 0.45)",
            opacity: 0.85,
            transform: "rotate(-4deg)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-[18px] rounded-full border border-[#5a3410]/40"
          style={{
            boxShadow: "inset 0 1px 2px rgba(255, 230, 180, 0.2)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full opacity-40"
          style={{
            background:
              "radial-gradient(circle at 30% 25%, rgba(255,240,210,0.45), transparent 45%)",
            mixBlendMode: "soft-light",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full opacity-25"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            mixBlendMode: "multiply",
          }}
        />
        {!locked && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-[6px] overflow-hidden rounded-full"
          >
            <span
              className="absolute inset-x-0 bottom-0 bg-[#f8edd8]/25 ease-linear"
              style={{
                height: holding ? "100%" : "0%",
                transitionProperty: "height",
                transitionDuration: holding ? `${HOLD_DURATION_MS}ms` : "150ms",
              }}
            />
          </span>
        )}
        <span
          className="relative z-10 px-3 text-center font-heading text-[0.8rem] leading-tight font-semibold tracking-[0.14em] text-[#f8edd8] uppercase sm:text-[0.95rem]"
          style={{
            textShadow:
              "0 1px 0 rgba(255, 230, 180, 0.25), 0 2px 3px rgba(40, 20, 5, 0.55)",
            transform: "rotate(-1deg)",
          }}
        >
          Hold
          <br />
          here
        </span>
      </button>
    </motion.div>
  );
}

export function LandingHero({ onOpenStart, onOpenComplete }: LandingHeroProps) {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<EnvelopePhase>("idle");
  const [holding, setHolding] = useState(false);
  const timersRef = useRef<number[]>([]);
  const holdTimerRef = useRef<number | null>(null);
  const holdingRef = useRef(false);
  const locked = phase !== "idle";
  const opening = phase === "opening";

  useEffect(() => {
    return () => {
      timersRef.current.forEach((id) => window.clearTimeout(id));
      if (holdTimerRef.current !== null) {
        window.clearTimeout(holdTimerRef.current);
      }
      stopVibrate();
    };
  }, []);

  const handleOpen = useCallback(async () => {
    if (phase !== "idle") return;

    vibrate(OPEN_VIBRATE);
    await onOpenStart();

    if (reduceMotion) {
      onOpenComplete();
      return;
    }

    setPhase("opening");
    timersRef.current.push(
      window.setTimeout(() => onOpenComplete(), SHUTTER_DURATION * 1000 + 80)
    );
  }, [onOpenComplete, onOpenStart, phase, reduceMotion]);

  const cancelHold = useCallback(() => {
    const wasHolding = holdTimerRef.current !== null || holdingRef.current;

    if (holdTimerRef.current !== null) {
      window.clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }

    if (holdingRef.current) {
      holdingRef.current = false;
      setHolding(false);
    }

    if (wasHolding && phase === "idle") {
      stopVibrate();
    }
  }, [phase]);

  const startHold = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (locked || event.button !== 0) return;

      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);

      cancelHold();
      holdingRef.current = true;
      setHolding(true);
      vibrate(HOLD_FEEDBACK_VIBRATE);

      holdTimerRef.current = window.setTimeout(() => {
        holdTimerRef.current = null;
        holdingRef.current = false;
        setHolding(false);
        handleOpen();
      }, HOLD_DURATION_MS);
    },
    [cancelHold, handleOpen, locked]
  );

  return (
    <section
      className="relative h-dvh w-full overflow-hidden [perspective:1600px]"
      aria-label="Wedding invitation envelope"
    >
      <span className="sr-only">
        Hold the wax seal for one second to open the invitation
      </span>

      <motion.div
        className="absolute inset-0 z-20 origin-top"
        initial={false}
        animate={
          opening
            ? { y: "100vh", rotateX: 6 }
            : { y: 0, rotateX: 0 }
        }
        transition={{
          duration: SHUTTER_DURATION,
          ease: SHUTTER_EASE,
        }}
        style={{
          transformPerspective: 1600,
          boxShadow: opening ? "0 -32px 56px rgba(42, 25, 8, 0.5)" : "none",
        }}
      >
        <EnvelopeTexture />
        <motion.p
          className="pointer-events-none absolute inset-x-0 bottom-8 z-20 text-center font-sans text-xs tracking-[0.28em] text-[#5a4124]/90 uppercase sm:bottom-10 sm:text-sm"
          animate={{ opacity: locked ? 0 : 1 }}
          transition={{ duration: 0.25 }}
          style={{
            textShadow: "0 1px 0 rgba(255, 245, 220, 0.35)",
          }}
        >
          Hold Seal To Open
        </motion.p>
      </motion.div>

      <motion.div
        className="absolute inset-x-0 top-0 z-30 h-[61%] origin-bottom [clip-path:polygon(0%_0%,100%_0%,100%_28%,50%_100%,0%_28%)] sm:h-[44%] sm:[clip-path:polygon(0%_0%,100%_0%,100%_12%,50%_100%,0%_12%)]"
        initial={false}
        animate={
          opening
            ? { y: "-100vh", rotateX: -6 }
            : { y: 0, rotateX: 0 }
        }
        transition={{
          duration: SHUTTER_DURATION,
          ease: SHUTTER_EASE,
        }}
        style={{
          transformPerspective: 1600,
          filter: opening
            ? "drop-shadow(0 28px 40px rgba(42, 25, 8, 0.5))"
            : "drop-shadow(0 14px 22px rgba(42, 25, 8, 0.38)) drop-shadow(0 5px 8px rgba(42, 25, 8, 0.28)) drop-shadow(0 1px 2px rgba(42, 25, 8, 0.22))",
        }}
      >
        <EnvelopeTexture />
        <div className="absolute inset-0 sm:hidden">
          <EnvelopeCoverThread hingeY={28} />
        </div>
        <div className="absolute inset-0 hidden sm:block">
          <EnvelopeCoverThread hingeY={12} />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[4]"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,248,235,0.12) 0%, transparent 42%, transparent 70%, rgba(90,55,15,0.12) 100%)",
            mixBlendMode: "soft-light",
          }}
        />
      </motion.div>

      <EnvelopeStamp
        locked={locked}
        holding={holding}
        opening={opening}
        onHoldStart={startHold}
        onHoldEnd={cancelHold}
      />
    </section>
  );
}
