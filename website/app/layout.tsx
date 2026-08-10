import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Providers } from "@/app/providers";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://product-engineer-pro.dev"),
  title: {
    default: "product-engineer-pro — Principal-Level AI Coding Skill",
    template: "%s | product-engineer-pro",
  },
  description:
    "An open-source engineering skill with capability-tiered integrations for planning, building, and reviewing supported full-stack applications.",
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
      "Cross-agent engineering workflows with host-native permissions, safe updates, and version-aware references. Open source and MIT licensed.",
    url: "https://product-engineer-pro.dev",
    siteName: "product-engineer-pro",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "product-engineer-pro — Principal-Level AI Coding Skill",
    description:
      "Cross-agent engineering workflows with honest host capability tiers. Open source and MIT licensed.",
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
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="bg-background text-foreground font-sans min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
