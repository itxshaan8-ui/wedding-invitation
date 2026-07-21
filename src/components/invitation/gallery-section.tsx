"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import { AnimateIn } from "@/components/invitation/animate-in";
import { SectionHeading } from "@/components/invitation/section-heading";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import type { GalleryImage } from "@/types/wedding";
import { cn } from "@/lib/utils";

interface GallerySectionProps {
  images: GalleryImage[];
}

export function GallerySection({ images }: GallerySectionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeImage = activeIndex === null ? null : images[activeIndex];

  const close = useCallback(() => setActiveIndex(null), []);

  const showNext = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null) return current;
      return (current + 1) % images.length;
    });
  }, [images.length]);

  const showPrev = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null) return current;
      return (current - 1 + images.length) % images.length;
    });
  }, [images.length]);

  useEffect(() => {
    if (activeIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") showNext();
      if (event.key === "ArrowLeft") showPrev();
      if (event.key === "Escape") close();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, close, showNext, showPrev]);

  return (
    <section id="gallery" className="section-padding" aria-labelledby="gallery-heading">
      <SectionHeading
        eyebrow="Memories"
        title="Our Gallery"
        description="A glimpse into the moments that brought us here — replace these placeholders with your photos anytime."
      />

      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
        {images.map((image, index) => (
          <AnimateIn key={image.id} delay={index * 0.05}>
            <button
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn(
                "group relative block w-full overflow-hidden rounded-2xl shadow-[0_10px_30px_rgba(42,35,31,0.08)] transition-transform duration-300 hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none",
                index % 5 === 2 ? "row-span-2 aspect-[3/4]" : "aspect-[4/3]"
              )}
              aria-label={`View photo: ${image.alt}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </button>
          </AnimateIn>
        ))}
      </div>

      <Dialog
        open={activeIndex !== null}
        onOpenChange={(open) => {
          if (!open) close();
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="max-w-4xl border-gold/20 bg-ink/95 p-0 text-white sm:max-w-4xl sm:rounded-3xl"
        >
          <DialogTitle className="sr-only">
            {activeImage?.alt ?? "Gallery image"}
          </DialogTitle>
          {activeImage ? (
            <div className="relative">
              <div className="relative aspect-[4/3] w-full sm:aspect-[16/10]">
                <Image
                  src={activeImage.src}
                  alt={activeImage.alt}
                  fill
                  sizes="90vw"
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
                <p className="text-sm text-white/80">{activeImage.alt}</p>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={showPrev}
                    className="rounded-full border-white/20 bg-transparent text-white hover:bg-white/10"
                  >
                    Prev
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={showNext}
                    className="rounded-full border-white/20 bg-transparent text-white hover:bg-white/10"
                  >
                    Next
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={close}
                    aria-label="Close gallery lightbox"
                    className="rounded-full text-white hover:bg-white/10"
                  >
                    <X className="size-5" />
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}
