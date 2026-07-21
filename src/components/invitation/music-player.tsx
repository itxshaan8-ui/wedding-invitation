"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { audioFallbackSrc, weddingConfig } from "@/config/wedding";
import { cn } from "@/lib/utils";

interface MusicPlayerProps {
  enabled: boolean;
  className?: string;
}

export function MusicPlayer({ enabled, className }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const audio = new Audio(weddingConfig.audioSrc);
    audio.loop = true;
    audio.volume = 0.35;
    audio.preload = "auto";
    audioRef.current = audio;

    const handleCanPlay = () => setIsReady(true);
    const handleError = () => {
      if (audio.src.endsWith(audioFallbackSrc)) {
        setIsReady(false);
        return;
      }
      audio.src = audioFallbackSrc;
      audio.load();
    };

    audio.addEventListener("canplaythrough", handleCanPlay);
    audio.addEventListener("error", handleError);

    return () => {
      audio.pause();
      audio.removeEventListener("canplaythrough", handleCanPlay);
      audio.removeEventListener("error", handleError);
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !enabled) return;

    const play = async () => {
      try {
        await audio.play();
        setIsMuted(false);
      } catch {
        setIsMuted(true);
      }
    };

    void play();
  }, [enabled]);

  const toggleMute = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted || audio.paused) {
      audio.muted = false;
      try {
        await audio.play();
        setIsMuted(false);
      } catch {
        setIsMuted(true);
      }
      return;
    }

    audio.muted = true;
    setIsMuted(true);
  };

  if (!enabled) return null;

  return (
    <div className={cn("fixed right-4 bottom-4 z-50 sm:right-6 sm:bottom-6", className)}>
      <Button
        type="button"
        size="icon-lg"
        variant="outline"
        onClick={toggleMute}
        aria-label={isMuted ? "Unmute background music" : "Mute background music"}
        aria-pressed={!isMuted}
        className="size-12 rounded-full border-gold/40 bg-black/50 text-white shadow-lg backdrop-blur-md hover:bg-black/70"
      >
        {isMuted || !isReady ? (
          <VolumeX className="size-5 text-gold-deep" />
        ) : (
          <Volume2 className="size-5 text-gold-deep" />
        )}
      </Button>
    </div>
  );
}
