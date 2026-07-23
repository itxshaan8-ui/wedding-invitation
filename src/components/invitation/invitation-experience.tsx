"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

import { ContactSection } from "@/components/invitation/contact-section";
import { GallerySection } from "@/components/invitation/gallery-section";
import { InvitationCard } from "@/components/invitation/invitation-card";
import { LandingHero } from "@/components/invitation/landing-hero";
import { MusicPlayer } from "@/components/invitation/music-player";
import { SiteFooter } from "@/components/invitation/site-footer";
import { TimelineSection } from "@/components/invitation/timeline-section";
import { VenueSection } from "@/components/invitation/venue-section";
import { weddingConfig } from "@/config/wedding";

const BG_SETTLE_DURATION = 2.4;
const CONTENT_REVEAL_DELAY = 1.55;

function InvitationBackdrop() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="invitation-backdrop" aria-hidden="true">
      <motion.div
        className="invitation-backdrop-image"
        initial={
          reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0.7, scale: 1.28 }
        }
        animate={{ opacity: 1, scale: 1 }}
        transition={
          reduceMotion
            ? { duration: 0.01 }
            : {
                duration: BG_SETTLE_DURATION,
                ease: [0.16, 1, 0.3, 1],
              }
        }
      />
      <motion.div
        className="invitation-backdrop-veil"
        initial={{ opacity: reduceMotion ? 1 : 0.35 }}
        animate={{ opacity: 1 }}
        transition={
          reduceMotion
            ? { duration: 0.01 }
            : { duration: 1.6, ease: [0.22, 1, 0.36, 1] }
        }
      />
    </div>
  );
}

export function InvitationExperience() {
  const [isOpen, setIsOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const img = new window.Image();
    img.src = "/images/invitation-bg.png";
  }, []);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    window.setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  }, []);

  const contentDelay = reduceMotion ? 0 : CONTENT_REVEAL_DELAY;

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:shadow-lg"
      >
        Skip to content
      </a>

      <AnimatePresence mode="wait">
        {!isOpen ? (
          <LandingHero key="landing" onOpen={handleOpen} />
        ) : (
          <motion.div
            key="invitation"
            id="main-content"
            className="invitation-details min-h-dvh"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <InvitationBackdrop />
            <InvitationCard revealDelay={contentDelay} />
            <TimelineSection events={weddingConfig.timeline} />
            <GallerySection images={weddingConfig.gallery} />
            <VenueSection venue={weddingConfig.venue} />
            <ContactSection contacts={weddingConfig.contacts} />
            <SiteFooter />
          </motion.div>
        )}
      </AnimatePresence>

      <MusicPlayer enabled={isOpen} />
    </>
  );
}
