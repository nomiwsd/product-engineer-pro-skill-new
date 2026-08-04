"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

interface AccordionItemData {
  value: string;
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItemData[];
  className?: string;
}

export function Accordion({ items, className }: AccordionProps) {
  const [openItem, setOpenItem] = React.useState<string | null>(items[0]?.value ?? null);
  const prefersReduced = useReducedMotion();

  return (
    <div
      className={cn(
        "w-full divide-y divide-border rounded-2xl border border-border overflow-hidden",
        "bg-card card-highlight",
        className
      )}
    >
      {items.map((item, idx) => {
        const isOpen = openItem === item.value;
        return (
          <div key={item.value} className="relative">
            <h3>
              <button
                type="button"
                id={`faq-trigger-${idx}`}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${idx}`}
                onClick={() => setOpenItem(isOpen ? null : item.value)}
                className={cn(
                  "flex w-full items-center justify-between gap-4 px-6 py-5 text-left",
                  "text-[0.9375rem] font-medium leading-snug transition-colors duration-150",
                  "hover:bg-background-subtle/60",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
                  isOpen ? "text-foreground" : "text-card-foreground"
                )}
              >
                <span className="flex items-center gap-3">
                  <span className="text-eyebrow text-muted-foreground w-5 shrink-0 text-right tabular-nums">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span>{item.title}</span>
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                    isOpen && "rotate-180 text-primary"
                  )}
                />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`faq-panel-${idx}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${idx}`}
                  key={item.value}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: "auto",
                    opacity: 1,
                    transition: {
                      height: { duration: prefersReduced ? 0 : 0.22 },
                      opacity: { duration: prefersReduced ? 0 : 0.18, delay: prefersReduced ? 0 : 0.04 },
                    },
                  }}
                  exit={{
                    height: 0,
                    opacity: 0,
                    transition: {
                      height: { duration: prefersReduced ? 0 : 0.18 },
                      opacity: { duration: prefersReduced ? 0 : 0.12 },
                    },
                  }}
                  style={{ overflow: "hidden" }}
                >
                  <div className="px-6 pb-6 pl-[calc(1.5rem+1.25rem+0.75rem)] text-sm leading-relaxed text-muted-foreground">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
