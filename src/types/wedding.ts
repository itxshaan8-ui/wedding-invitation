export type AttendanceStatus = "yes" | "no" | "maybe";

export interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  icon: "ceremony" | "reception" | "dinner" | "party" | "photos";
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface ContactInfo {
  label: string;
  value: string;
  href: string;
  type: "phone" | "email" | "whatsapp";
}

export interface RsvpPayload {
  name: string;
  email: string;
  guests: number;
  attending: AttendanceStatus;
  message?: string;
}

export interface WeddingConfig {
  bride: string;
  groom: string;
  monogram: string;
  tagline: string;
  weddingDate: string;
  weddingDateDisplay: string;
  venue: {
    name: string;
    address: string;
    city: string;
    mapsUrl: string;
  };
  timeline: TimelineEvent[];
  gallery: GalleryImage[];
  contacts: ContactInfo[];
  audioSrc: string;
}
