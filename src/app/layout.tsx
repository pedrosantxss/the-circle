import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/LanguageContext";
import { Cursor } from "@/components/effects/Cursor";
import { NoiseOverlay } from "@/components/effects/NoiseOverlay";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500"],
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "The Circle — Where the Ambitious Converge",
  description:
    "An elite ecosystem for founders, creators, and visionaries building the next era of innovation.",
  openGraph: {
    title: "The Circle",
    description: "Where the ambitious converge.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Circle",
    description: "Where the ambitious converge.",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${spaceGrotesk.variable} ${spaceMono.variable}`}
    >
      <body>
        <LanguageProvider>
          <NoiseOverlay />
          <Cursor />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
