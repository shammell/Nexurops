import { NextResponse } from "next/server";
import { LeadSource } from "@prisma/client";
import { z } from "zod";
import { db } from "@/lib/db";

export const runtime = "nodejs";

const leadSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Enter a valid email").max(200),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  service: z.string().trim().max(120).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Tell us a bit more (10+ characters)").max(4000),
  // Honeypot: real users never fill this.
  hp_url: z.string().max(0).optional().or(z.literal("")),
  // Truncate (never reject) attribution params; a long campaign string must not lose a lead.
  utmSource: z.string().transform((v) => v.slice(0, 120)).optional(),
  utmMedium: z.string().transform((v) => v.slice(0, 120)).optional(),
  utmCampaign: z.string().transform((v) => v.slice(0, 120)).optional(),
});

// Per-instance, in-memory limiter (5 submissions / hour / IP). Good enough to blunt
// form spam; replace with a shared store (Redis/Upstash) when running multiple instances.
const hits = new Map<string, number[]>();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_HITS = 5;

function isLimited(ip: string | null): boolean {
  if (!ip) return false; // no trustworthy client key: don't let one shared bucket lock everyone out
  const now = Date.now();
  return (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS).length >= MAX_HITS;
}

/** Only successful, valid submissions count toward the quota. */
function record(ip: string | null) {
  if (!ip) return;
  const now = Date.now();
  hits.set(ip, [...(hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS), now]);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
  }
}

export async function POST(req: Request) {
  // NOTE: x-forwarded-for is only trustworthy behind a proxy that overwrites it (e.g. Vercel).
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
  if (isLimited(ip)) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(json);
  if (!parsed.success) {
    // Honeypot hits get a silent success so bots don't adapt.
    if (parsed.error.issues.some((i) => i.path[0] === "hp_url")) {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json(
      { error: "Validation failed", fields: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }
  const d = parsed.data;
  record(ip);

  try {
    await db.lead.create({
      data: {
        name: d.name,
        email: d.email,
        service: d.service || null,
        message: d.message,
        source: LeadSource.WEBSITE,
        utmSource: d.utmSource ?? null,
        utmMedium: d.utmMedium ?? null,
        utmCampaign: d.utmCampaign ?? null,
        metadata: {
          company: d.company || null,
          referer: req.headers.get("referer"),
          userAgent: req.headers.get("user-agent"),
          ip: ip ?? "unknown",
        },
      },
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[leads] failed to save lead", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "We couldn't save your message right now. Please book a call instead." },
      { status: 503 },
    );
  }
}
