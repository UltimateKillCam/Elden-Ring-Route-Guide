import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:5173";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  return {
    metadataBase: new URL(origin),
    title: "Tarnished Together | Elden Ring Co-op Route Planner",
    description: "Plan a 2–6 player Elden Ring run with assigned gear, level and upgrade targets, quests, maps, and every Remembrance boss.",
    icons: { icon: "/og.png", shortcut: "/og.png" },
    openGraph: {
      title: "Tarnished Together",
      description: "An Elden Ring co-op route planner for 2–6 players, covering the base game and Shadow of the Erdtree.",
      type: "website",
      images: [{ url: `${origin}/og.png`, width: 1674, height: 941, alt: "Tarnished Together, an Elden Ring co-op route planner" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Tarnished Together",
      description: "An Elden Ring co-op route planner for 2–6 players, covering the base game and Shadow of the Erdtree.",
      images: [`${origin}/og.png`],
    },
  };
}

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
