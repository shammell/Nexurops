"use client";

import { useState, type FormEvent } from "react";
import { serviceOptions } from "@/lib/marketing/content";
import { Button } from "@/components/ui/button";
import { CalendlyButton } from "./CalendlyButton";

type Status = "idle" | "sending" | "sent" | "error";
type Fields = Record<string, string[] | undefined>;

const input =
  "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-white/30 focus-visible:border-primary-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/40";
const label = "mb-1.5 block font-mono text-[10px] uppercase tracking-[0.25em] text-white/50";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [fields, setFields] = useState<Fields>({});
  const [who, setWho] = useState({ name: "", email: "" });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const params = new URLSearchParams(window.location.search);
    setStatus("sending");
    setError("");
    setFields({});
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          utmSource: params.get("utm_source") ?? undefined,
          utmMedium: params.get("utm_medium") ?? undefined,
          utmCampaign: params.get("utm_campaign") ?? undefined,
        }),
      });
      if (res.ok) {
        setWho({ name: data.name ?? "", email: data.email ?? "" });
        setStatus("sent");
        form.reset();
        return;
      }
      const body = (await res.json().catch(() => ({}))) as { error?: string; fields?: Fields };
      setFields(body.fields ?? {});
      setError(body.error ?? "Something went wrong.");
      setStatus("error");
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="rounded-2xl border border-primary-400/30 bg-primary-500/10 p-8 text-center">
        <h3 className="font-display text-2xl font-light">Message received.</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          We'll reply within one business day. Want to skip the wait?
        </p>
        <CalendlyButton prefill={who} className="mt-6 rounded-full">
          Book a call now ↗
        </CalendlyButton>
      </div>
    );
  }

  const err = (k: string) =>
    fields[k]?.[0] ? (
      <p id={`${k}-err`} className="mt-1 text-xs text-red-400">
        {fields[k]?.[0]}
      </p>
    ) : null;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5 rounded-2xl border border-white/10 bg-card/50 p-6 backdrop-blur-md md:p-8">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="name" className={label}>Name</label>
          <input id="name" name="name" required autoComplete="name" className={input} aria-describedby="name-err" placeholder="Your name" />
          {err("name")}
        </div>
        <div>
          <label htmlFor="email" className={label}>Email</label>
          <input id="email" name="email" type="email" required autoComplete="email" className={input} aria-describedby="email-err" placeholder="you@company.com" />
          {err("email")}
        </div>
        <div>
          <label htmlFor="company" className={label}>Company (optional)</label>
          <input id="company" name="company" autoComplete="organization" className={input} placeholder="Company" />
        </div>
        <div>
          <label htmlFor="service" className={label}>Interested in</label>
          <select id="service" name="service" defaultValue="" className={input}>
            <option value="" className="bg-background">Select…</option>
            {serviceOptions.map((s) => (
              <option key={s} value={s} className="bg-background">{s}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="message" className={label}>What are you trying to solve?</label>
        <textarea id="message" name="message" required rows={5} className={input} aria-describedby="message-err" placeholder="Tell us about your stack and goals…" />
        {err("message")}
      </div>
      {/* Honeypot */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input name="hp_url" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {status === "error" && error && (
        <p role="alert" className="text-sm text-red-400">{error}</p>
      )}
      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={status === "sending"} size="lg" className="rounded-full">
          {status === "sending" ? "Sending…" : "Send message"}
        </Button>
        <CalendlyButton variant="ghost" size="lg" className="rounded-full">
          Or book a call ↗
        </CalendlyButton>
      </div>
    </form>
  );
}
