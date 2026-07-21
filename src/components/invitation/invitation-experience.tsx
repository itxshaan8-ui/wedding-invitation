"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useState } from "react";

import { ContactSection } from "@/components/invitation/contact-section";
import { GallerySection } from "@/components/invitation/gallery-section";
import { InvitationCard } from "@/components/invitation/invitation-card";
import { LandingHero } from "@/components/invitation/landing-hero";
import { MusicPlayer } from "@/components/invitation/music-player";
import { RsvpSection } from "@/components/invitation/rsvp-section";
import { SiteFooter } from "@/components/invitation/site-footer";
import { TimelineSection } from "@/components/invitation/timeline-section";
import { VenueSection } from "@/components/invitation/venue-section";
import { weddingConfig } from "@/config/wedding";

export function InvitationExperience() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    window.setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  }, []);

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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <InvitationCard />
            <TimelineSection events={weddingConfig.timeline} />
            <GallerySection images={weddingConfig.gallery} />
            <VenueSection venue={weddingConfig.venue} />
            <RsvpSection />
            <ContactSection contacts={weddingConfig.contacts} />
            <SiteFooter />
          </motion.div>
        )}
      </AnimatePresence>

      <MusicPlayer enabled={isOpen} />
    </>
  );
}
