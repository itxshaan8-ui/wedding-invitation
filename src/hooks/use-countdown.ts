"use client";

import { useEffect, useState } from "react";

export interface CountdownValue {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
}

function resolveTargetMs(target: number | string): number {
  if (typeof target === "number") {
    return target;
  }

  const asNumber = Number(target);
  if (!Number.isNaN(asNumber) && target.trim() !== "") {
    return asNumber;
  }

  return new Date(target).getTime();
}

function getTimeLeft(target: number | string): CountdownValue {
  const targetMs = resolveTargetMs(target);
  const diff = targetMs - Date.now();

  if (!Number.isFinite(targetMs) || diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds, isComplete: false };
}

export function useCountdown(target: number | string): CountdownValue {
  const [timeLeft, setTimeLeft] = useState<CountdownValue>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isComplete: false,
  });
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const tick = () => setTimeLeft(getTimeLeft(target));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [target]);

  if (!hasMounted) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isComplete: false,
    };
  }

  return timeLeft;
}
