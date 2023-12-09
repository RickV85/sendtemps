import type { Metadata } from "next";
import { Fugaz_One, Hanuman } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "SendTemps",
  description:
    "A simple, personalized, pinpoint weather app for your outdoor adventures in the Colorado Front Range.",
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
      <body>{children}</body>
    </html>
  );
}
