"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

import { FloralBackground } from "@/components/invitation/floral-background";
import { weddingConfig } from "@/config/wedding";

interface LandingHeroProps {
  onOpen: () => void;
}

type EnvelopePhase = "idle" | "opening" | "revealed" | "exit";

const FLAP_CLOSED = "polygon(0% 0%, 100% 0%, 50% 100%)";
const FLAP_OPEN = "polygon(0% 0%, 100% 0%, 50% 0%)";

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
            ? {
                opacity: exiting ? 1 : 0.9,
                scale: exiting ? 2.8 : 1.2,
              }
            : { opacity: 0, scale: 0.2 }
        }
        transition={{
          duration: exiting ? 0.85 : 1.7,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,250,240,0.95) 18%, rgba(232,213,176,0.55) 40%, transparent 70%)",
          boxShadow:
            "0 0 40px 20px rgba(255,255,255,0.9), 0 0 90px 45px rgba(232,213,176,0.45), 0 0 160px 80px rgba(196,165,116,0.2)",
        }}
      />

      <motion.div
        className="absolute size-[min(40vw,12rem)] rounded-full bg-white"
        initial={false}
        animate={
          showCircle || exiting
            ? {
                opacity: exiting ? 1 : 0.65,
                scale: exiting ? 4 : 1,
              }
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
        animate={{
          opacity: exiting ? 1 : showCircle ? 0.18 : 0,
        }}
        transition={{ duration: exiting ? 0.8 : 1.5 }}
        style={{
          background:
            "radial-gradient(circle at center, rgba(255,255,255,0.95) 0%, rgba(255,252,248,0.7) 30%, rgba(247,243,238,0.4) 55%, transparent 75%)",
        }}
      />
    </div>
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
      window.setTimeout(() => setPhase("revealed"), 1100),
      window.setTimeout(() => setPhase("exit"), 2200),
      window.setTimeout(() => onOpen(), 3000)
    );
  }, [locked, onOpen, reduceMotion]);

  const flapOpen = phase !== "idle";
  const showRays = phase !== "idle";
  const showCircle = phase === "revealed" || phase === "exit";
  const isExiting = phase === "exit";

  return (
    <motion.section
      className="relative flex min-h-dvh items-center justify-center overflow-hidden px-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: phase === "exit" ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Wedding invitation envelope"
    >
      <FloralBackground />

      <div className="relative z-10 flex w-full max-w-lg flex-col items-center">
        <motion.p
          className="mb-8 text-center text-xs font-medium tracking-[0.32em] text-gold-deep uppercase sm:text-sm"
          animate={{ opacity: locked ? 0 : 1, y: locked ? -10 : 0 }}
          transition={{ duration: 0.35 }}
        >
          {weddingConfig.groom} & {weddingConfig.bride}
        </motion.p>

        <motion.div
          animate={locked ? { y: 0 } : { y: [0, -5, 0] }}
          transition={
            locked
              ? { duration: 0.3 }
              : { duration: 4.8, repeat: Infinity, ease: "easeInOut" }
          }
          className="w-full max-w-[22rem] sm:max-w-[26rem]"
        >
          <button
            type="button"
            onClick={handleOpen}
            disabled={locked}
            aria-label="Click the envelope to open the invitation"
            className="group relative block w-full cursor-pointer border-0 bg-transparent p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-pearl disabled:cursor-default"
          >
            <span className="sr-only">Click here to open invitation</span>

            <div
              className="relative mx-auto w-full"
              style={{ aspectRatio: "5 / 3.4" }}
            >
              <div className="absolute inset-0 overflow-hidden rounded-[0.35rem_0.35rem_1.1rem_1.1rem] border border-[#c4a574]/55 bg-[linear-gradient(160deg,#fffaf3_0%,#f0e2cf_48%,#e2c9a2_100%)] shadow-[0_22px_50px_rgba(42,35,31,0.14)]">
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.5)_0%,transparent_40%,rgba(196,165,116,0.12)_100%)]" />
                <p className="absolute inset-x-0 bottom-[14%] z-[1] text-center font-heading text-2xl tracking-wide text-ink/75 sm:text-3xl">
                  {weddingConfig.monogram}
                </p>
              </div>

              <div className="absolute inset-x-0 top-0 z-[3] h-[46%]">
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    clipPath: FLAP_CLOSED,
                    background:
                      "linear-gradient(180deg, #ffffff 0%, #fffdf9 42%, #f7f1e8 100%)",
                    boxShadow: "inset 0 8px 18px rgba(42, 35, 31, 0.06)",
                  }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(circle at 50% 70%, rgba(255,255,255,1) 0%, rgba(255,255,255,0.2) 55%, transparent 75%)",
                    }}
                  />
                </div>

                <motion.div
                  className="absolute inset-0 origin-top"
                  initial={false}
                  animate={{
                    clipPath: flapOpen ? FLAP_OPEN : FLAP_CLOSED,
                  }}
                  transition={{
                    duration: 0.95,
                    ease: [0.45, 0, 0.2, 1],
                  }}
                  style={{
                    background:
                      "linear-gradient(180deg, #f3e6d2 0%, #e4cbab 45%, #c9a66c 100%)",
                    boxShadow: "0 10px 22px rgba(139, 111, 58, 0.16)",
                  }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,0.35) 0%, transparent 60%)",
                    }}
                  />
                </motion.div>

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 z-[4] h-px bg-[#c4a574]/70"
                />

                <motion.div
                  className="absolute left-1/2 z-[5] flex size-[4.75rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center sm:size-[5.5rem]"
                  initial={false}
                  animate={
                    flapOpen
                      ? { top: "0%", opacity: 0, scale: 0.65 }
                      : { top: "100%", opacity: 1, scale: [1, 1.045, 1] }
                  }
                  transition={
                    flapOpen
                      ? {
                          top: { duration: 0.95, ease: [0.45, 0, 0.2, 1] },
                          opacity: { duration: 0.35, delay: 0.15 },
                          scale: { duration: 0.35, delay: 0.15 },
                        }
                      : {
                          top: { duration: 0 },
                          scale: {
                            duration: 2.3,
                            repeat: Infinity,
                            ease: "easeInOut",
                          },
                        }
                  }
                >
                  <div className="relative flex size-full items-center justify-center rounded-full border-[3px] border-dashed border-[#e8d5b0]/90 bg-[linear-gradient(145deg,#8b6f3a_0%,#c4a574_48%,#e8d5b0_100%)] shadow-[0_10px_24px_rgba(139,111,58,0.32),inset_0_1px_0_rgba(255,255,255,0.35)] transition-transform duration-300 group-hover:scale-[1.04]">
                    <div className="absolute inset-[7px] rounded-full border border-[#f3e6d2]/55" />
                    <span className="relative px-2 text-center font-sans text-[0.65rem] font-semibold tracking-[0.12em] text-[#fffaf3] uppercase sm:text-xs">
                      Click
                      <br />
                      here
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>
          </button>
        </motion.div>

        <motion.p
          className="mt-10 text-center text-sm tracking-[0.18em] text-muted-foreground uppercase"
          animate={{ opacity: locked ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        >
          Your invitation awaits
        </motion.p>
      </div>

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
