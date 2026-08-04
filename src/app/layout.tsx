import type { Metadata, Viewport } from "next";
import { Caveat, Playfair_Display, Poppins } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";

import { weddingConfig } from "@/config/wedding";

import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-caveat",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const title = `${weddingConfig.groom} & ${weddingConfig.bride} | Wedding Invitation`;
const description = `${weddingConfig.tagline} for the wedding of ${weddingConfig.groom} and ${weddingConfig.bride} on ${weddingConfig.weddingDateDisplay} at ${weddingConfig.venue.name}.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  keywords: [
    "wedding invitation",
    weddingConfig.groom,
    weddingConfig.bride,
    weddingConfig.venue.city,
    "RSVP",
  ],
  authors: [{ name: `${weddingConfig.groom} & ${weddingConfig.bride}` }],
  openGraph: {
    title,
    description,
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: title,
    images: [
      {
        url: weddingConfig.gallery[0]?.src ?? "/og.jpg",
        width: weddingConfig.gallery[0]?.width ?? 1200,
        height: weddingConfig.gallery[0]?.height ?? 800,
        alt: weddingConfig.gallery[0]?.alt ?? `${weddingConfig.groom} and ${weddingConfig.bride}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [weddingConfig.gallery[0]?.src ?? "/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f3ee",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${poppins.variable} ${caveat.variable} antialiased`}
      >
        {children}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
