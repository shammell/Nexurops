"use client";

import { useEffect, useState } from "react";
import { CalendlyButton } from "./CalendlyButton";

/**
 * Mobile-only bottom bar: keeps the next step one tap away once the hero CTA has
 * scrolled out of view, and hides again near the contact form to avoid doubling up.
 */
export function StickyCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const contact = document.getElementById("contact");
      const nearContact = contact ? contact.getBoundingClientRect().top < window.innerHeight : false;
      setShow(window.scrollY > window.innerHeight * 0.8 && !nearContact);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      // `invisible` (visibility: hidden) also removes the button from the tab order while hidden.
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-background/90 p-3 backdrop-blur-xl transition-[transform,visibility] duration-300 md:hidden ${
        show ? "visible translate-y-0" : "invisible translate-y-full"
      }`}
    >
      <div className="flex items-center gap-3">
        <p className="flex-1 text-xs leading-tight text-muted-foreground">
          Fixed price · <span className="text-foreground">live in 10 days or refund</span>
        </p>
        <CalendlyButton variant="cta" size="sm" className="rounded-full">
          Book free call →
        </CalendlyButton>
      </div>
    </div>
  );
}
