"use client";

import type { ReactNode } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { CALENDLY_URL, loadCalendly, openCalendly, type CalendlyPrefill } from "@/lib/marketing/calendly";

type Props = {
  children: ReactNode;
  prefill?: CalendlyPrefill;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
};

/**
 * Opens the Calendly popup. If NEXT_PUBLIC_CALENDLY_URL is unset it degrades to
 * a link to the contact form instead of throwing.
 */
export function CalendlyButton({ children, prefill, variant, size, className }: Props) {
  if (!CALENDLY_URL) {
    return (
      <Button asChild variant={variant} size={size} className={className}>
        <a href="/#contact">{children}</a>
      </Button>
    );
  }
  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      onPointerEnter={() => void loadCalendly().catch(() => undefined)}
      onClick={() => void openCalendly(prefill)}
    >
      {children}
    </Button>
  );
}
