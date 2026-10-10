const SCRIPT_SRC = "https://assets.calendly.com/assets/external/widget.js";
const CSS_HREF = "https://assets.calendly.com/assets/external/widget.css";

declare global {
  interface Window {
    Calendly?: { initPopupWidget: (opts: { url: string }) => void };
  }
}

export const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL ?? "";

export type CalendlyPrefill = { name?: string; email?: string };

let loading: Promise<void> | null = null;

/** Lazy-load Calendly's widget script + stylesheet once. */
export function loadCalendly(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.Calendly) return Promise.resolve();
  if (loading) return loading;

  loading = new Promise<void>((resolve, reject) => {
    if (!document.querySelector(`link[href="${CSS_HREF}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = CSS_HREF;
      document.head.appendChild(link);
    }
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      loading = null;
      reject(new Error("Calendly script failed to load"));
    };
    document.body.appendChild(script);
  });
  return loading;
}

function buildUrl(base: string, prefill?: CalendlyPrefill): string {
  const url = new URL(base);
  url.searchParams.set("background_color", "05060a");
  url.searchParams.set("text_color", "ffffff");
  url.searchParams.set("primary_color", "38bdf8");
  if (prefill?.name) url.searchParams.set("name", prefill.name);
  if (prefill?.email) url.searchParams.set("email", prefill.email);
  return url.toString();
}

/** Open the Calendly popup; falls back to a new tab if the script is blocked. */
export async function openCalendly(
  prefill?: CalendlyPrefill,
  opts: { fallbackToTab?: boolean } = {},
): Promise<void> {
  if (!CALENDLY_URL) return;
  const url = buildUrl(CALENDLY_URL, prefill);
  try {
    await loadCalendly();
    if (!window.Calendly) throw new Error("Calendly unavailable");
    window.Calendly.initPopupWidget({ url });
  } catch {
    // Only safe from a user gesture; popup blockers swallow it otherwise.
    if (opts.fallbackToTab ?? true) window.open(url, "_blank", "noopener,noreferrer");
  }
}
