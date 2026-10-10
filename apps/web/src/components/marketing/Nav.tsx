"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { navLinks } from "@/lib/marketing/content";
import { CalendlyButton } from "./CalendlyButton";

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-4 z-40 flex justify-center px-4">
      <nav
        aria-label="Primary"
        className="flex w-full max-w-4xl items-center justify-between gap-4 rounded-full border border-white/10 bg-background/60 px-4 py-2 backdrop-blur-xl"
      >
        <Link href="/" className="flex items-center gap-2" aria-label="Nexurops home">
          <Image src="/nexurops-logo.jpg" alt="" width={28} height={28} className="rounded-md" priority />
          <span className="font-display text-sm font-medium tracking-wide">Nexurops</span>
        </Link>

        <ul className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="transition-colors hover:text-foreground">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            href="/client/dashboard"
            className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground lg:block"
          >
            Client portal
          </Link>
          <CalendlyButton variant="cta" size="sm" className="rounded-full">
            Book a call ↗
          </CalendlyButton>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="rounded-full p-2 text-muted-foreground hover:text-foreground md:hidden"
          >
            <span className="block h-0.5 w-5 bg-current" />
            <span className="mt-1 block h-0.5 w-5 bg-current" />
          </button>
        </div>
      </nav>

      {open && (
        <div
          id="mobile-menu"
          className="absolute top-14 w-[calc(100%-2rem)] max-w-4xl rounded-2xl border border-white/10 bg-background/90 p-4 backdrop-blur-xl md:hidden"
        >
          <ul className="flex flex-col gap-3 text-sm">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)} className="block py-1 text-muted-foreground">
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <Link href="/client/dashboard" className="block py-1 text-muted-foreground">
                Client portal
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
