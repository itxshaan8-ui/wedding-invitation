import { Heart } from "lucide-react";

import { weddingConfig } from "@/config/wedding";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gold/15 px-5 py-12 text-center">
      <p className="font-heading text-2xl text-ink sm:text-3xl">
        {weddingConfig.groom}{" "}
        <span className="text-gold-deep">&</span> {weddingConfig.bride}
      </p>
      <p className="mt-3 flex items-center justify-center gap-2 text-sm text-muted-foreground">
        With love
        <Heart className="size-3.5 fill-gold text-gold" aria-hidden="true" />
        {year}
      </p>
      <p className="mt-2 text-xs tracking-[0.18em] text-muted-foreground/80 uppercase">
        {weddingConfig.weddingDateDisplay}
      </p>
    </footer>
  );
}
