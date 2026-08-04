import type { WeddingConfig } from "@/types/wedding";

export const weddingConfig: WeddingConfig = {
  bride: "Duaa Hashim",
  groom: "Muhammad Hassaan",
  monogram: "H & D",
  tagline: "Request the pleasure of your company",
  weddingDate: "2026-10-24T19:00:00+05:00",
  weddingTimestamp: 1792850400000,
  weddingDateDisplay: "Saturday, October 24, 2026 · 7:00 PM",
  weddingDateLine: "Saturday, October 24, 2026",
  weddingTimeLine: "7:00 PM",
  venue: {
    name: "Kallisto Grand Marquee",
    address: "Tap below for directions",
    city: "",
    mapsUrl: "https://maps.app.goo.gl/kUoDtaZNHTWdEznM6",
  },
  timeline: [
    {
      id: "1",
      time: "7:00 PM",
      title: "Guest Arrival",
      description: "Welcome drinks and soft music as guests gather.",
      icon: "photos",
    },
    {
      id: "2",
      time: "8:00 PM",
      title: "Ceremony",
      description: "Exchange of vows as we begin our forever.",
      icon: "ceremony",
    },
    {
      id: "3",
      time: "9:00 PM",
      title: "Dinner",
      description: "A shared feast with family and friends.",
      icon: "dinner",
    },
  ],
  gallery: [
    {
      id: "1",
      src: "https://i.ibb.co/YTJTBZLs/ss3.jpg",
      alt: "Muhammad Hassaan and Duaa Hashim — reception illustration",
      width: 415,
      height: 739,
    },
    {
      id: "2",
      src: "https://i.ibb.co/Pvg8PvFD/s3.jpg",
      alt: "Muhammad Hassaan and Duaa Hashim — photo 2",
      width: 401,
      height: 498,
    },
    {
      id: "3",
      src: "https://i.ibb.co/BVsJg5Q7/s2.jpg",
      alt: "Muhammad Hassaan and Duaa Hashim — photo 3",
      width: 547,
      height: 365,
    },
    {
      id: "4",
      src: "https://i.ibb.co/JR4VNNgh/s1.jpg",
      alt: "Muhammad Hassaan and Duaa Hashim — photo 4",
      width: 335,
      height: 597,
    },
  ],
  contacts: [
    {
      label: "Phone 1",
      value: "03335946695",
      href: "tel:+923335946695",
      type: "phone",
    },
    {
      label: "Phone 2",
      value: "03347500404",
      href: "tel:+923347500404",
      type: "phone",
    },
    {
      label: "Email",
      value: "shaanitis@gmail.com",
      href: "mailto:shaanitis@gmail.com",
      type: "email",
    },
    {
      label: "WhatsApp",
      value: "Message us on WhatsApp",
      href: "https://wa.me/923347500404",
      type: "whatsapp",
    },
  ],
  audioSrc: "/audio/background.mp3",
};

/** Placeholder audio currently ships as WAV until you add an MP3. */
export const audioFallbackSrc = "/audio/background.wav";
