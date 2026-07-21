import type { RsvpPayload } from "@/types/wedding";

export function formatWeddingDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(isoDate));
}

export function validateRsvp(payload: RsvpPayload): string | null {
  if (!payload.name.trim()) return "Please enter your name.";
  if (!payload.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    return "Please enter a valid email address.";
  }
  if (payload.guests < 1 || payload.guests > 10) {
    return "Guest count must be between 1 and 10.";
  }
  if (!["yes", "no", "maybe"].includes(payload.attending)) {
    return "Please select your attendance.";
  }
  return null;
}
