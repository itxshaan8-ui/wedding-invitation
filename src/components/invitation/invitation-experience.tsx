"use client";

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
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const img = new window.Image();
    img.src = "/images/invitation-bg.png";
  }, []);

  useEffect(() => {
    if (!showDetails || !showLanding) return;

    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [showDetails, showLanding]);

  const handleOpenStart = useCallback(async () => {
    setShowDetails(true);
    await waitForNextPaint();
  }, []);

  const handleOpenComplete = useCallback(() => {
    setShowLanding(false);
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

      {showDetails ? (
        <div
          id="main-content"
          className="invitation-details relative z-10 min-h-dvh"
        >
          <InvitationBackdrop />
          <InvitationCard revealDelay={0} />
          <TimelineSection
            events={weddingConfig.timeline}
            revealDelay={0}
          />
          <GallerySection images={weddingConfig.gallery} />
          <VenueSection venue={weddingConfig.venue} />
          <ContactSection contacts={weddingConfig.contacts} />
          <SiteFooter />
        </div>
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
