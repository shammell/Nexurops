"use client";

import { useEffect, useRef } from "react";
import { CalendlyButton } from "@/components/marketing/CalendlyButton";
import { CALENDLY_URL, openCalendly } from "@/lib/marketing/calendly";

/** Auto-opens the popup for shared /book links; the button is the fallback if it's dismissed or blocked. */
export function BookClient() {
  const opened = useRef(false);
  useEffect(() => {
    if (!CALENDLY_URL || opened.current) return; // StrictMode runs effects twice in dev
    opened.current = true;
    void openCalendly(undefined, { fallbackToTab: false });
  }, []);

  return (
    <div className="mt-8 flex flex-col items-center gap-4">
      <CalendlyButton size="lg" className="rounded-full">
        Pick a time ↗
      </CalendlyButton>
      {!CALENDLY_URL && (
        <p className="text-sm text-muted-foreground">
          Scheduling isn't connected yet. Use the contact form instead.
        </p>
      )}
    </div>
  );
}
