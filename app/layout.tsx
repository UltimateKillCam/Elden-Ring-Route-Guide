import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

export const dynamic = "force-static";
const socialImage = `${process.env.PAGES_BASE_PATH || ""}/og.png`;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tarnished Together | Elden Ring Co-op Route Planner",
  description: "Plan a solo or 2–6 player Elden Ring run with assigned gear, level and upgrade targets, quests, maps, and every Remembrance boss.",
  icons: { icon: socialImage, shortcut: socialImage },
  openGraph: {
    title: "Tarnished Together",
    description: "An Elden Ring route planner for solo and 2–6 player runs, covering the base game and Shadow of the Erdtree.",
    type: "website",
    images: [{ url: socialImage, width: 1674, height: 941, alt: "Tarnished Together, an Elden Ring co-op route planner" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tarnished Together",
    description: "An Elden Ring route planner for solo and 2–6 player runs, covering the base game and Shadow of the Erdtree.",
    images: [socialImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
