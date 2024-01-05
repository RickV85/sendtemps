import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Fugaz_One, Hanuman } from "next/font/google";
import "./globals.css";
import { UserProvider } from "./Contexts/UserContext";

export const metadata: Metadata = {
  title: "SendTemps - Backcountry Forecasts for the Colorado Front Range",
  description:
    "A simple, personalized, pinpoint weather app for your outdoor adventures in the Colorado Front Range.",
  manifest: "/manifest.json",
  icons: {
    apple: "/icon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: "https://sendtemps.vercel.app",
    title: "SendTemps",
    description: "A simple, personalized, pinpoint weather app for your outdoor adventures in the Colorado Front Range.",
    siteName: "SendTemps",
    images: [
      {
        url: "/icon-512x512.png",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#2A3C43",
};

const fugazOne = Fugaz_One({
  subsets: ["latin"],
  display: "swap",
  style: "normal",
  weight: "400",
  preload: true,
  variable: "--font-fugazOne",
});

const hanuman = Hanuman({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "700", "900"],
  style: "normal",
  preload: true,
  variable: "--font-hanuman",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fugazOne.variable} ${hanuman.variable}`}>
      <body>
        <UserProvider>{children}</UserProvider>
        <Analytics />
      </body>
    </html>
  );
}
