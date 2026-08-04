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

type EnvelopePhase = "idle" | "opening" | "bloom" | "exit";

const HOLD_DURATION_MS = 1000;
const SHUTTER_DURATION = 1.9;
const SHUTTER_EASE = [0.66, 0.02, 0.28, 1] as const;
const HOLD_FEEDBACK_VIBRATE = [25, 90, 25, 90, 30, 90, 35, 90, 40] as number[];
const OPEN_VIBRATE = [90, 45, 140, 50, 220, 60, 255] as number[];

export const SPLASH_TRANSITION_DURATION = SHUTTER_DURATION;

const LIGHT_RAYS = [
  { angle: -8, width: 3, length: 48, delay: 0 },
  { angle: 14, width: 5, length: 68, delay: 0.07 },
  { angle: -28, width: 2, length: 42, delay: 0.12 },
  { angle: 36, width: 4, length: 74, delay: 0.18 },
  { angle: -48, width: 6, length: 58, delay: 0.24 },
  { angle: 58, width: 2.5, length: 82, delay: 0.3 },
  { angle: -72, width: 3.5, length: 64, delay: 0.36 },
  { angle: 78, width: 7, length: 90, delay: 0.42 },
  { angle: -98, width: 2, length: 52, delay: 0.48 },
  { angle: 112, width: 4.5, length: 76, delay: 0.54 },
  { angle: -128, width: 3, length: 60, delay: 0.6 },
  { angle: 148, width: 5.5, length: 86, delay: 0.66 },
  { angle: -158, width: 2.5, length: 46, delay: 0.72 },
  { angle: 172, width: 4, length: 70, delay: 0.78 },
  { angle: -178, width: 8, length: 95, delay: 0.84 },
  { angle: 22, width: 1.5, length: 38, delay: 0.2 },
  { angle: -62, width: 1.8, length: 34, delay: 0.4 },
  { angle: 96, width: 2.2, length: 44, delay: 0.56 },
] as const;

function RevealLight({
  showRays,
  showCircle,
  exiting,
}: {
  showRays: boolean;
  showCircle: boolean;
  exiting: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[45] flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {LIGHT_RAYS.map((ray, index) => (
          <div
            key={`${ray.angle}-${index}`}
            className="absolute top-1/2 left-1/2"
            style={{ transform: `rotate(${ray.angle}deg)` }}
          >
            <motion.div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 origin-bottom"
              style={{
                width: `${ray.width}px`,
                height: `${ray.length}vmin`,
                background:
                  ray.width >= 5
                    ? "linear-gradient(to top, rgba(255,255,255,0.95) 0%, rgba(255,248,230,0.75) 35%, rgba(232,213,176,0.25) 70%, transparent 100%)"
                    : "linear-gradient(to top, rgba(255,255,255,0.9) 0%, rgba(255,250,240,0.55) 40%, transparent 100%)",
                borderRadius: "999px",
                filter: ray.width >= 5 ? "blur(0.6px)" : "blur(0.3px)",
                boxShadow:
                  ray.width >= 4
                    ? "0 0 12px 2px rgba(255,255,255,0.55)"
                    : "0 0 6px 1px rgba(255,255,255,0.35)",
              }}
              initial={false}
              animate={
                showRays
                  ? {
                      opacity: exiting ? [0.85, 1, 0] : 1,
                      scaleY: exiting ? [1, 1.45, 1.9] : 1,
                      scaleX: exiting ? [1, 1.12, 0.65] : 1,
                    }
                  : { opacity: 0, scaleY: 0.08, scaleX: 0.35 }
              }
              transition={{
                duration: exiting ? 1.05 : 0.85,
                delay:
                  showRays && !exiting
                    ? ray.delay
                    : exiting
                      ? ray.delay * 0.08
                      : 0,
                ease: [0.16, 1, 0.3, 1],
                times: exiting ? [0, 0.4, 1] : undefined,
              }}
            />
          </div>
        ))}
      </div>

      <motion.div
        className="absolute size-[min(70vw,22rem)] rounded-full"
        initial={false}
        animate={
          showCircle || exiting
            ? {
                opacity: exiting ? [0.85, 1, 0] : 0.9,
                scale: exiting ? [1.2, 2.6, 3.2] : 1.2,
              }
            : { opacity: 0, scale: 0.2 }
        }
        transition={{
          duration: exiting ? 1.05 : 1.7,
          ease: [0.22, 1, 0.36, 1],
          times: exiting ? [0, 0.4, 1] : undefined,
        }}
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,250,240,0.95) 18%, rgba(232,213,176,0.55) 40%, transparent 70%)",
          boxShadow:
            "0 0 40px 20px rgba(255,255,255,0.9), 0 0 90px 45px rgba(232,213,176,0.45)",
        }}
      />

      <motion.div
        className="absolute size-[min(40vw,12rem)] rounded-full bg-white"
        initial={false}
        animate={
          showCircle || exiting
            ? {
                opacity: exiting ? [0.55, 0.95, 0] : 0.65,
                scale: exiting ? [1, 3.4, 4.2] : 1,
              }
            : { opacity: 0, scale: 0.15 }
        }
        transition={{
          duration: exiting ? 1.05 : 1.9,
          delay: showCircle && !exiting ? 0.2 : 0,
          ease: [0.22, 1, 0.36, 1],
          times: exiting ? [0, 0.4, 1] : undefined,
        }}
        style={{
          filter: "blur(2px)",
          boxShadow: "0 0 50px 30px rgba(255,255,255,0.95)",
        }}
      />

      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{
          opacity: exiting ? [0.2, 0.92, 0] : showCircle ? 0.18 : 0,
        }}
        transition={{
          duration: exiting ? 1.05 : 1.5,
          times: exiting ? [0, 0.38, 1] : undefined,
        }}
        style={{
          background:
            "radial-gradient(circle at center, rgba(255,255,255,0.95) 0%, rgba(255,252,248,0.7) 30%, transparent 75%)",
        }}
      />
    </div>
  );
}

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
  const opening = phase !== "idle";
  const showRays = phase !== "idle";
  const showCircle = phase === "bloom" || phase === "exit";
  const isExiting = phase === "exit";

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
    const shutterMs = SHUTTER_DURATION * 1000;
    timersRef.current.push(
      window.setTimeout(() => setPhase("bloom"), shutterMs * 0.42),
      window.setTimeout(() => setPhase("exit"), shutterMs * 0.72),
      window.setTimeout(() => onOpenComplete(), shutterMs * 0.72 + 1100)
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

      <RevealLight
        showRays={showRays}
        showCircle={showCircle}
        exiting={isExiting}
      />
    </section>
  );
}
