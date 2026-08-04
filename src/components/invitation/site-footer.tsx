import { Heart } from "lucide-react";

import { weddingConfig } from "@/config/wedding";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gold/15 px-5 py-12 text-center">
      <p className="flex flex-col items-center font-heading text-2xl leading-snug text-ink sm:text-3xl">
        <span>{weddingConfig.groom}</span>
        <span className="my-0.5 text-gold-deep">&</span>
        <span>{weddingConfig.bride}</span>
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
