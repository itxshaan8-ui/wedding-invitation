"use client";

import { motion, useReducedMotion } from "framer-motion";

interface FloralMotifProps {
  className?: string;
  delay?: number;
  scale?: number;
  rotate?: number;
}

function FloralMotif({
  className,
  delay = 0,
  scale = 1,
  rotate = 0,
}: FloralMotifProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.svg
      aria-hidden="true"
      viewBox="0 0 120 140"
      className={className}
      style={{ scale, rotate }}
      animate={
        reduceMotion
          ? undefined
          : {
              y: [0, -14, 0],
              rotate: [rotate, rotate + 4, rotate],
            }
      }
      transition={{
        duration: 8 + delay,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      <defs>
        <linearGradient id="petalGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e8d5b0" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#c4a574" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="leafSage" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#d7e0d4" />
          <stop offset="100%" stopColor="#9fb39a" stopOpacity="0.7" />
        </linearGradient>
      </defs>
      <path
        d="M60 70 C40 40 20 45 18 70 C20 95 40 100 60 70 Z"
        fill="url(#petalGold)"
      />
      <path
        d="M60 70 C80 40 100 45 102 70 C100 95 80 100 60 70 Z"
        fill="url(#petalGold)"
      />
      <path
        d="M60 70 C45 45 48 20 60 18 C72 20 75 45 60 70 Z"
        fill="url(#petalGold)"
      />
      <path
        d="M60 70 C45 95 48 120 60 122 C72 120 75 95 60 70 Z"
        fill="url(#petalGold)"
      />
      <circle cx="60" cy="70" r="8" fill="#8b6f3a" opacity="0.45" />
      <path
        d="M60 78 C58 100 70 118 88 124"
        fill="none"
        stroke="url(#leafSage)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <ellipse
        cx="78"
        cy="108"
        rx="10"
        ry="5"
        fill="url(#leafSage)"
        transform="rotate(-25 78 108)"
      />
    </motion.svg>
  );
}

export function FloralBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <FloralMotif
        className="absolute -top-4 -left-2 h-36 w-36 opacity-70 sm:h-48 sm:w-48"
        delay={0}
        scale={1.1}
        rotate={-12}
      />
      <FloralMotif
        className="absolute top-1/4 -right-6 h-40 w-40 opacity-60 sm:h-52 sm:w-52"
        delay={1.2}
        scale={1}
        rotate={18}
      />
      <FloralMotif
        className="absolute bottom-16 left-[8%] h-28 w-28 opacity-50 sm:h-36 sm:w-36"
        delay={2}
        scale={0.9}
        rotate={-6}
      />
      <FloralMotif
        className="absolute right-[12%] bottom-8 h-32 w-32 opacity-55 sm:h-40 sm:w-40"
        delay={0.6}
        scale={1.05}
        rotate={22}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(247,243,238,0.55)_100%)]" />
    </div>
  );
}
