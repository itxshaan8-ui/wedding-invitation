"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

import { ContactSection } from "@/components/invitation/contact-section";
import { GallerySection } from "@/components/invitation/gallery-section";
import { InvitationCard } from "@/components/invitation/invitation-card";
import {
  LandingHero,
} from "@/components/invitation/landing-hero";
import { MusicPlayer } from "@/components/invitation/music-player";
import { SiteFooter } from "@/components/invitation/site-footer";
import { TimelineSection } from "@/components/invitation/timeline-section";
import { VenueSection } from "@/components/invitation/venue-section";
import { weddingConfig } from "@/config/wedding";

const DETAILS_RISE_DURATION = 1.15;
const DETAILS_RISE_EASE = [0.22, 0.08, 0.18, 1] as const;

function InvitationBackdrop() {
  return (
    <div className="invitation-backdrop" aria-hidden="true">
      <div className="invitation-backdrop-image" />
      <div className="invitation-backdrop-veil" />
    </div>
  );
}

function waitForNextPaint() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

export function InvitationExperience() {
  const [showLanding, setShowLanding] = useState(true);
  const [showBackdrop, setShowBackdrop] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const img = new window.Image();
    img.src = "/images/invitation-bg.png";
  }, []);

  useEffect(() => {
    if (!showLanding || (!showBackdrop && !showDetails)) return;

    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [showBackdrop, showDetails, showLanding]);

  const handleOpenStart = useCallback(async () => {
    setShowBackdrop(true);
    await waitForNextPaint();
  }, []);

  const handleOpenComplete = useCallback(() => {
    setShowLanding(false);
    setShowDetails(true);
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:shadow-lg"
      >
        Skip to content
      </a>

      {showBackdrop || showDetails ? <InvitationBackdrop /> : null}

      {showDetails ? (
        <motion.div
          id="main-content"
          className="invitation-details relative z-10 min-h-dvh origin-bottom"
          initial={
            reduceMotion
              ? { opacity: 1, y: 0, scale: 1 }
              : { opacity: 0, y: "55vh", scale: 0.74 }
          }
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={
            reduceMotion
              ? { duration: 0.01 }
              : {
                  duration: DETAILS_RISE_DURATION,
                  ease: DETAILS_RISE_EASE,
                }
          }
        >
          <InvitationCard revealDelay={0} />
          <TimelineSection events={weddingConfig.timeline} revealDelay={0} />
          <GallerySection images={weddingConfig.gallery} />
          <VenueSection venue={weddingConfig.venue} />
          <ContactSection contacts={weddingConfig.contacts} />
          <SiteFooter />
        </motion.div>
      ) : null}

      {showLanding ? (
        <div className="fixed inset-0 z-30">
          <LandingHero
            onOpenStart={handleOpenStart}
            onOpenComplete={handleOpenComplete}
          />
        </div>
      ) : null}

      <MusicPlayer enabled={showDetails && !showLanding} />
    </>
  );
}
