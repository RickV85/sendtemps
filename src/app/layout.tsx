import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WeatherWise",
  description:
    "Simple, personalized, pinpoint weather forecasts for your outdoor hobbies",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
