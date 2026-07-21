import type { WeddingConfig } from "@/types/wedding";

export const weddingConfig: WeddingConfig = {
  bride: "Sophia",
  groom: "Alexander",
  monogram: "S & A",
  tagline: "Request the pleasure of your company",
  weddingDate: "2026-10-17T16:00:00",
  weddingDateDisplay: "Saturday, October 17, 2026 · 4:00 PM",
  venue: {
    name: "The Grand Rose Estate",
    address: "128 Garden Lane",
    city: "Napa Valley, California",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Napa+Valley+California",
  },
  timeline: [
    {
      id: "1",
      time: "3:30 PM",
      title: "Guest Arrival",
      description: "Welcome drinks and soft music in the garden courtyard.",
      icon: "photos",
    },
    {
      id: "2",
      time: "4:00 PM",
      title: "Ceremony",
      description: "Exchange of vows beneath the rose arch.",
      icon: "ceremony",
    },
    {
      id: "3",
      time: "5:00 PM",
      title: "Cocktail Hour",
      description: "Champagne, canapés, and golden-hour portraits.",
      icon: "reception",
    },
    {
      id: "4",
      time: "7:00 PM",
      title: "Dinner Reception",
      description: "A seated feast under candlelight and starlit skies.",
      icon: "dinner",
    },
    {
      id: "5",
      time: "9:00 PM",
      title: "Dancing & Celebration",
      description: "Live music, cake cutting, and dancing until midnight.",
      icon: "party",
    },
  ],
  gallery: [
    {
      id: "1",
      src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
      alt: "Couple holding hands on their wedding day",
      width: 1200,
      height: 800,
    },
    {
      id: "2",
      src: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80",
      alt: "Elegant wedding table setting with florals",
      width: 1200,
      height: 800,
    },
    {
      id: "3",
      src: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80",
      alt: "Bride and groom walking through a garden",
      width: 1200,
      height: 1600,
    },
    {
      id: "4",
      src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
      alt: "Wedding rings on soft petals",
      width: 1200,
      height: 800,
    },
    {
      id: "5",
      src: "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?auto=format&fit=crop&w=1200&q=80",
      alt: "Romantic outdoor ceremony setup",
      width: 1200,
      height: 800,
    },
    {
      id: "6",
      src: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=80",
      alt: "Couple sharing a quiet moment",
      width: 1200,
      height: 1600,
    },
  ],
  contacts: [
    {
      label: "Sophia",
      value: "+1 (555) 234-5678",
      href: "tel:+15552345678",
      type: "phone",
    },
    {
      label: "Alexander",
      value: "+1 (555) 876-5432",
      href: "tel:+15558765432",
      type: "phone",
    },
    {
      label: "Email",
      value: "rsvp@sophiaandalexander.com",
      href: "mailto:rsvp@sophiaandalexander.com",
      type: "email",
    },
    {
      label: "WhatsApp",
      value: "Message the couple",
      href: "https://wa.me/15552345678",
      type: "whatsapp",
    },
  ],
  audioSrc: "/audio/background.mp3",
};

/** Placeholder audio currently ships as WAV until you add an MP3. */
export const audioFallbackSrc = "/audio/background.wav";
