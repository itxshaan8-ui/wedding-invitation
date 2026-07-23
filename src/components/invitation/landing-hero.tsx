"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

interface LandingHeroProps {
  onOpen: () => void;
}

type EnvelopePhase = "idle" | "opening" | "revealed" | "exit";

const FLAP_CLOSED = "polygon(0% 0%, 100% 0%, 50% 100%)";
const FLAP_OPEN = "polygon(0% 0%, 100% 0%, 50% 0%)";
const FLAP_INNER_CLOSED = "polygon(3.8% 3.2%, 96.2% 3.2%, 50% 90%)";
const FLAP_INNER_OPEN = "polygon(3.8% 3.2%, 96.2% 3.2%, 50% 3.2%)";
const FLAP_BORDER_CLOSED = "polygon(0% 0%, 100% 0%, 50% 100%)";
const FLAP_BORDER_OPEN = "polygon(0% 0%, 100% 0%, 50% 0%)";
const FLAP_ROPE_CLOSED = "0,0 100,0 50,100";
const FLAP_ROPE_OPEN = "0,0 100,0 50,0";

const FLAP_EASE = [0.22, 0.05, 0.18, 1] as const;
const FLAP_DURATION = 2.15;

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

interface RevealLightProps {
  showRays: boolean;
  showCircle: boolean;
  exiting: boolean;
}

function RevealLight({ showRays, showCircle, exiting }: RevealLightProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center overflow-hidden"
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
                      opacity: exiting ? [0.9, 1, 0] : 1,
                      scaleY: exiting ? [1, 1.4, 1.85] : 1,
                      scaleX: exiting ? [1, 1.15, 0.7] : 1,
                    }
                  : { opacity: 0, scaleY: 0.08, scaleX: 0.35 }
              }
              transition={{
                duration: exiting ? 0.75 : 0.85,
                delay: showRays && !exiting ? ray.delay : exiting ? ray.delay * 0.1 : 0,
                ease: [0.16, 1, 0.3, 1],
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
            ? { opacity: exiting ? 1 : 0.9, scale: exiting ? 2.8 : 1.2 }
            : { opacity: 0, scale: 0.2 }
        }
        transition={{ duration: exiting ? 0.85 : 1.7, ease: [0.22, 1, 0.36, 1] }}
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
            ? { opacity: exiting ? 1 : 0.65, scale: exiting ? 4 : 1 }
            : { opacity: 0, scale: 0.15 }
        }
        transition={{
          duration: exiting ? 0.8 : 1.9,
          delay: showCircle && !exiting ? 0.2 : 0,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{
          filter: "blur(2px)",
          boxShadow: "0 0 50px 30px rgba(255,255,255,0.95)",
        }}
      />

      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{ opacity: exiting ? 1 : showCircle ? 0.18 : 0 }}
        transition={{ duration: exiting ? 0.8 : 1.5 }}
        style={{
          background:
            "radial-gradient(circle at center, rgba(255,255,255,0.95) 0%, rgba(255,252,248,0.7) 30%, transparent 75%)",
        }}
      />
    </div>
  );
}

function EnvelopeStamp({
  open,
  locked,
}: {
  open: boolean;
  locked: boolean;
}) {
  return (
    <motion.div
      className="absolute top-1/2 left-1/2 z-20 flex size-[7.25rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center sm:size-[8.75rem]"
      initial={false}
      animate={
        open
          ? { opacity: 0, scale: 0.7, y: -36, rotate: -8 }
          : { opacity: 1, scale: [1, 1.03, 1], y: 0, rotate: -2 }
      }
      transition={
        open
          ? { duration: 0.7, delay: 0.15, ease: "easeOut" }
          : {
              scale: { duration: 2.8, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 0 },
            }
      }
    >
      <div
        className={`stamp-wax relative flex size-full items-center justify-center rounded-full transition-transform duration-300 ${
          locked ? "" : "group-hover:scale-[1.05] group-hover:-rotate-1"
        }`}
        style={{
          filter: "contrast(1.04) saturate(0.95)",
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
        <span
          className="relative z-10 px-3 text-center font-heading text-[0.8rem] leading-tight font-semibold tracking-[0.14em] text-[#f8edd8] uppercase sm:text-[0.95rem]"
          style={{
            textShadow:
              "0 1px 0 rgba(255, 230, 180, 0.25), 0 2px 3px rgba(40, 20, 5, 0.55)",
            transform: "rotate(-1deg)",
          }}
        >
          Click
          <br />
          here
        </span>
      </div>
    </motion.div>
  );
}

export function LandingHero({ onOpen }: LandingHeroProps) {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<EnvelopePhase>("idle");
  const timersRef = useRef<number[]>([]);
  const locked = phase !== "idle";

  useEffect(() => {
    return () => {
      timersRef.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const handleOpen = useCallback(() => {
    if (locked) return;

    if (reduceMotion) {
      onOpen();
      return;
    }

    setPhase("opening");

    timersRef.current.push(
      window.setTimeout(() => setPhase("revealed"), 2100),
      window.setTimeout(() => setPhase("exit"), 3300),
      window.setTimeout(() => onOpen(), 4100)
    );
  }, [locked, onOpen, reduceMotion]);

  const flapOpen = phase !== "idle";
  const showRays = phase !== "idle";
  const showCircle = phase === "revealed" || phase === "exit";
  const isExiting = phase === "exit";

  return (
    <motion.section
      className="relative h-dvh w-full overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: phase === "exit" ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Wedding invitation envelope"
    >
      <button
        type="button"
        onClick={handleOpen}
        disabled={locked}
        aria-label="Click the envelope to open the invitation"
        className="group absolute inset-0 h-full w-full cursor-pointer border-0 p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-inset disabled:cursor-default"
      >
        <span className="sr-only">Click here to open invitation</span>

        <div className="envelope-royal absolute inset-0">
          <div className="envelope-damask absolute inset-0" />
          <div className="envelope-noise absolute inset-0" />
          <div
            aria-hidden="true"
            className="absolute inset-[10px] rounded-[2px] border border-[#8b6f3a]/25 sm:inset-[14px]"
            style={{
              boxShadow:
                "inset 0 0 0 1px rgba(255, 240, 210, 0.18), inset 0 0 40px rgba(90, 55, 15, 0.08)",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-[18px] rounded-[1px] border border-dashed border-[#c4a574]/20 sm:inset-[24px]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1/3"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,248,235,0.28), transparent)",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-1/4"
            style={{
              background:
                "linear-gradient(0deg, rgba(80,50,15,0.18), transparent)",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-y-[12%] left-[8%] w-px bg-gradient-to-b from-transparent via-[#8b6f3a]/25 to-transparent"
          />
          <div
            aria-hidden="true"
            className="absolute inset-y-[12%] right-[8%] w-px bg-gradient-to-b from-transparent via-[#8b6f3a]/25 to-transparent"
          />
        </div>

        <div className="absolute inset-x-0 top-0 z-[3] h-[46%] sm:h-[44%]">
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              clipPath: FLAP_CLOSED,
              background:
                "linear-gradient(180deg, #fffdf8 0%, #f7efe3 45%, #efe2cf 100%)",
              boxShadow: "inset 0 10px 24px rgba(42, 35, 31, 0.08)",
            }}
          >
            <div className="envelope-noise absolute inset-0 opacity-20" />
            <div className="envelope-damask absolute inset-0 opacity-40" />
          </div>

          <motion.div
            aria-hidden="true"
            className="absolute inset-0 origin-top"
            initial={false}
            animate={{ clipPath: flapOpen ? FLAP_BORDER_OPEN : FLAP_BORDER_CLOSED }}
            transition={{ duration: FLAP_DURATION, ease: FLAP_EASE }}
            style={{
              background:
                "linear-gradient(180deg, #4a3212 0%, #6e4f22 35%, #8b6f3a 70%, #5a3d16 100%)",
              transform: "translateY(2px)",
              filter:
                "drop-shadow(0 6px 10px rgba(42, 25, 8, 0.28)) drop-shadow(0 2px 4px rgba(42, 25, 8, 0.2))",
            }}
          />

          <motion.div
            className="envelope-royal-flap envelope-flap-edge absolute inset-0 origin-top"
            initial={false}
            animate={{ clipPath: flapOpen ? FLAP_OPEN : FLAP_CLOSED }}
            transition={{ duration: FLAP_DURATION, ease: FLAP_EASE }}
          >
            <div className="envelope-noise absolute inset-0" />
            <div className="envelope-damask absolute inset-0 opacity-80" />
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,245,220,0.12) 35%, transparent 62%)",
              }}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, rgba(90,55,15,0.16) 0%, transparent 18%, transparent 82%, rgba(90,55,15,0.16) 100%)",
              }}
            />
          </motion.div>

          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 origin-top"
            initial={false}
            animate={{
              clipPath: flapOpen ? FLAP_INNER_OPEN : FLAP_INNER_CLOSED,
            }}
            transition={{ duration: FLAP_DURATION, ease: FLAP_EASE }}
            style={{
              boxShadow:
                "inset 0 0 0 1px rgba(255, 236, 200, 0.35), inset 0 0 18px rgba(90, 55, 15, 0.08)",
            }}
          />

          <motion.svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[6] h-full w-full overflow-visible"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            initial={false}
          >
            <motion.polygon
              fill="none"
              stroke="#4a3212"
              strokeWidth="3.4"
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              initial={false}
              animate={{ points: flapOpen ? FLAP_ROPE_OPEN : FLAP_ROPE_CLOSED }}
              transition={{ duration: FLAP_DURATION, ease: FLAP_EASE }}
              style={{ opacity: 0.95 }}
            />
            <motion.polygon
              fill="none"
              stroke="#c4a574"
              strokeWidth="2.4"
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeDasharray="2.4 1.6"
              vectorEffect="non-scaling-stroke"
              initial={false}
              animate={{ points: flapOpen ? FLAP_ROPE_OPEN : FLAP_ROPE_CLOSED }}
              transition={{ duration: FLAP_DURATION, ease: FLAP_EASE }}
              style={{ opacity: 0.95 }}
            />
            <motion.polygon
              fill="none"
              stroke="#f3e6d2"
              strokeWidth="2.4"
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeDasharray="2.4 1.6"
              strokeDashoffset="2"
              vectorEffect="non-scaling-stroke"
              initial={false}
              animate={{ points: flapOpen ? FLAP_ROPE_OPEN : FLAP_ROPE_CLOSED }}
              transition={{ duration: FLAP_DURATION, ease: FLAP_EASE }}
              style={{ opacity: 0.88 }}
            />
            <motion.polygon
              fill="none"
              stroke="#8b5e2b"
              strokeWidth="1.15"
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeDasharray="1.1 2.9"
              strokeDashoffset="1.2"
              vectorEffect="non-scaling-stroke"
              initial={false}
              animate={{ points: flapOpen ? FLAP_ROPE_OPEN : FLAP_ROPE_CLOSED }}
              transition={{ duration: FLAP_DURATION, ease: FLAP_EASE }}
              style={{ opacity: 0.9 }}
            />
            <motion.polygon
              fill="none"
              stroke="#fff6e4"
              strokeWidth="0.55"
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              initial={false}
              animate={{ points: flapOpen ? FLAP_ROPE_OPEN : FLAP_ROPE_CLOSED }}
              transition={{ duration: FLAP_DURATION, ease: FLAP_EASE }}
              style={{ opacity: 0.45 }}
            />
          </motion.svg>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 z-[7] h-[4px] bg-gradient-to-r from-[#4a3212]/35 via-[#e8d5b0]/80 to-[#4a3212]/35"
            style={{
              boxShadow: "0 3px 8px rgba(42, 25, 8, 0.22)",
            }}
          />
        </div>

        <EnvelopeStamp open={flapOpen} locked={locked} />

        <motion.p
          className="absolute inset-x-0 bottom-8 z-20 text-center font-sans text-xs tracking-[0.28em] text-[#5a4124]/90 uppercase sm:bottom-10 sm:text-sm"
          animate={{ opacity: locked ? 0 : 1 }}
          transition={{ duration: 0.3 }}
          style={{
            textShadow: "0 1px 0 rgba(255, 245, 220, 0.35)",
          }}
        >
          Your Invitation Awaits
        </motion.p>
      </button>

      <RevealLight
        showRays={showRays}
        showCircle={showCircle}
        exiting={isExiting}
      />

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-50"
        initial={false}
        animate={{ opacity: phase === "exit" ? 1 : 0 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background:
            "radial-gradient(circle at center, #ffffff 0%, #fffcf8 35%, #f7f3ee 100%)",
        }}
      />
    </motion.section>
  );
}
