import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/app/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://product-engineer-pro.dev"),
  title: {
    default: "product-engineer-pro — Principal-Level AI Coding Skill",
    template: "%s | product-engineer-pro",
  },
  description:
    "An open-source, MIT-licensed AI coding skill that turns any AI coding agent (Claude, GPT, Gemini, local models) into a principal-level engineer across Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, Node.js, Express, NestJS, PostgreSQL, and MongoDB.",
  keywords: [
    "AI coding skill",
    "product engineer pro",
    "Next.js AI agent",
    "Claude skill",
    "Cursor rules",
    "Windsurf rules",
    "AGENTS.md",
    "TypeScript engineering standards",
    "Tailwind v4",
    "shadcn/ui",
    "NestJS",
    "PostgreSQL",
    "MongoDB",
    "open source coding standards",
  ],
  authors: [{ name: "product-engineer-pro Contributors" }],
  creator: "product-engineer-pro",
  openGraph: {
    title: "product-engineer-pro — Principal-Level AI Coding Skill",
    description:
      "Turn any AI agent (Claude, GPT, Gemini, local models) into a principal-level engineer. Open-source, MIT licensed. Next.js · React · TypeScript · Tailwind CSS · NestJS · PostgreSQL · MongoDB.",
    url: "https://product-engineer-pro.dev",
    siteName: "product-engineer-pro",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "product-engineer-pro — Principal-Level AI Coding Skill",
    description:
      "Turn any AI agent into a principal engineer across Next.js, React, TypeScript, Tailwind CSS, NestJS, PostgreSQL, and MongoDB. Open-source & MIT licensed.",
    creator: "@productengpro",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning is required: next-themes mutates the class
    // attribute on <html> via its blocking script before React hydrates,
    // which would otherwise trigger a hydration mismatch warning.
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="bg-background text-foreground font-sans min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
