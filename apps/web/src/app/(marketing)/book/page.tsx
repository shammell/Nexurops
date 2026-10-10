import type { Metadata } from "next";
import { BookClient } from "./BookClient";

export const metadata: Metadata = {
  title: "Book a call | Nexurops",
  description: "Book a strategy call with Nexurops to talk AI agents and DevOps automation.",
};

export default function BookPage() {
  return (
    <section data-scene="4" className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-xl text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary-300">Book a call</p>
        <h1 className="mt-4 font-display text-4xl font-light md:text-6xl">Let's talk about your infrastructure.</h1>
        <p className="mt-4 text-muted-foreground">30 minutes. We review your stack and outline where agents and automation help most.</p>
        <BookClient />
      </div>
    </section>
  );
}
