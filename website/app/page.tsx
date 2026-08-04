import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { StackMarquee } from "@/components/StackMarquee";
import { Features } from "@/components/Features";
import { ModesShowcase } from "@/components/ModesShowcase";
import { Install } from "@/components/Install";
import { FAQ } from "@/components/FAQ";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/*
        Skip-to-main-content link — WCAG 2.2 AA Success Criterion 2.4.1
        Visually hidden by default (sr-only), shown on keyboard focus.
      */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2.5 focus:rounded-lg focus:bg-primary focus:text-primary-foreground focus:font-mono focus:text-sm focus:font-semibold focus:shadow-glow focus:outline-none"
      >
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        <Hero />
        <StackMarquee />
        <Features />
        <ModesShowcase />
        <Install />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
