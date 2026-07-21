"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { AnimateIn } from "@/components/invitation/animate-in";
import { GlassCard, SectionHeading } from "@/components/invitation/section-heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase";
import { validateRsvp } from "@/lib/wedding";
import type { AttendanceStatus, RsvpPayload } from "@/types/wedding";

const initialForm: RsvpPayload = {
  name: "",
  email: "",
  guests: 1,
  attending: "yes",
  message: "",
};

export function RsvpSection() {
  const [form, setForm] = useState<RsvpPayload>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const error = validateRsvp(form);
    if (error) {
      toast.error(error);
      return;
    }

    setIsSubmitting(true);

    try {
      if (!isSupabaseConfigured()) {
        await new Promise((resolve) => setTimeout(resolve, 700));
        toast.success("RSVP received (demo mode). Connect Supabase to save responses.");
        setForm(initialForm);
        return;
      }

      const supabase = getSupabaseBrowserClient();
      if (!supabase) {
        toast.error("Supabase is not configured.");
        return;
      }

      const { error: insertError } = await supabase.from("rsvps").insert({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        guests: form.guests,
        attending: form.attending,
        message: form.message?.trim() || null,
      });

      if (insertError) {
        throw insertError;
      }

      toast.success("Thank you! Your RSVP has been received.");
      setForm(initialForm);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="rsvp" className="section-padding" aria-labelledby="rsvp-heading">
      <SectionHeading
        eyebrow="Kindly Reply"
        title="RSVP"
        description="We would be honored by your presence. Please let us know if you can celebrate with us."
      />

      <AnimateIn>
        <GlassCard className="mx-auto max-w-xl">
          <h3 id="rsvp-heading" className="sr-only">
            RSVP form
          </h3>
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                name="name"
                autoComplete="name"
                required
                value={form.name}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, name: event.target.value }))
                }
                placeholder="Your full name"
                className="h-11 rounded-xl border-gold/20 bg-white/70"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, email: event.target.value }))
                }
                placeholder="you@example.com"
                className="h-11 rounded-xl border-gold/20 bg-white/70"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="guests">Number of guests</Label>
                <Input
                  id="guests"
                  name="guests"
                  type="number"
                  min={1}
                  max={10}
                  required
                  value={form.guests}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      guests: Number(event.target.value) || 1,
                    }))
                  }
                  className="h-11 rounded-xl border-gold/20 bg-white/70"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="attending">Will you attend?</Label>
                <Select
                  value={form.attending}
                  onValueChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      attending: (value ?? "yes") as AttendanceStatus,
                    }))
                  }
                >
                  <SelectTrigger
                    id="attending"
                    className="h-11 w-full rounded-xl border-gold/20 bg-white/70"
                  >
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Joyfully accepts</SelectItem>
                    <SelectItem value="no">Regretfully declines</SelectItem>
                    <SelectItem value="maybe">Hopeful, but unsure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message (optional)</Label>
              <Textarea
                id="message"
                name="message"
                rows={4}
                value={form.message}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, message: event.target.value }))
                }
                placeholder="Share a note, song request, or dietary need..."
                className="rounded-xl border-gold/20 bg-white/70"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              size="lg"
              className="h-12 w-full rounded-full border border-gold/35 bg-gradient-to-r from-gold-deep via-gold to-gold-soft tracking-[0.14em] text-primary-foreground uppercase shadow-md transition-transform hover:scale-[1.01]"
            >
              {isSubmitting ? "Sending..." : "Send RSVP"}
            </Button>
          </form>
        </GlassCard>
      </AnimateIn>
    </section>
  );
}
