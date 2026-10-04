import { test, expect } from "@playwright/test";

const CALENDLY = "https://calendly.com/example/30min";
let ipSeq = 0;
// The leads route rate-limits per x-forwarded-for; use a unique IP per request.
const uniqueIp = () => ({ "x-forwarded-for": `10.${Date.now() % 250}.${++ipSeq}.${Math.floor(Math.random() * 250)}` });

const valid = {
  name: "E2E Tester",
  email: "e2e@example.com",
  message: "This is an automated end-to-end test message.",
};

test("home loads: h1, no pageerror, canvas", async ({ page }) => {
  test.setTimeout(150_000); // cold `next dev` compiles the lazy three.js chunk on first hit
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("AI agents");
  await expect(page.locator("canvas").first()).toBeAttached({ timeout: 120_000 });
  expect(errors).toEqual([]);
});

test("nav Book a call opens calendly overlay", async ({ page }) => {
  await page.goto("/");
  const btn = page.locator("header, nav").getByRole("button", { name: /Book a call/ }).first();
  const overlay = page.locator(".calendly-overlay");
  // SSR renders the button before React hydrates; a click before hydration is a no-op, so retry.
  await expect(async () => {
    await btn.click();
    await expect(overlay).toBeAttached({ timeout: 3_000 });
  }).toPass({ timeout: 45_000, intervals: [500, 1_000, 2_000] });
  const iframe = overlay.locator("iframe");
  await expect(iframe).toBeAttached();
  expect(await iframe.getAttribute("src")).toMatch(new RegExp("^" + CALENDLY.replace(/[.\/]/g, "\$&")));
});

test.describe("/api/leads", () => {
  test("422 on invalid body", async ({ request }) => {
    const r = await request.post("/api/leads", { data: { name: "", email: "nope", message: "x" }, headers: uniqueIp() });
    expect(r.status()).toBe(422);
  });

  test("200 on honeypot", async ({ request }) => {
    const r = await request.post("/api/leads", { data: { ...valid, hp_url: "http://spam.example" }, headers: uniqueIp() });
    expect(r.status()).toBe(200);
    expect(await r.json()).toEqual({ ok: true });
  });

  test("valid body returns 200 or 503", async ({ request }) => {
    const r = await request.post("/api/leads", { data: valid, headers: uniqueIp() });
    expect([200, 503]).toContain(r.status());
  });

  test("form UI shows success status or alert", async ({ page }) => {
    await page.route("**/api/leads", (route) =>
      route.continue({ headers: { ...route.request().headers(), ...uniqueIp() } }),
    );
    await page.goto("/");
    await page.locator("#name").fill(valid.name);
    await page.locator("#email").fill(valid.email);
    await page.locator("#message").fill(valid.message);
    await page.getByRole("button", { name: "Send message" }).click();
    const sent = page.getByRole("status").filter({ hasText: "Message received" });
    const alert = page.locator("form").getByRole("alert");
    await expect(sent.or(alert)).toBeVisible();
  });
});

test.describe("mobile", () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  test("no horizontal overflow", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
    const { sw, cw } = await page.evaluate(() => ({
      sw: document.documentElement.scrollWidth,
      cw: document.documentElement.clientWidth,
    }));
    expect(sw).toBeLessThanOrEqual(cw);
  });
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });
  test("no canvas", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("AI agents");
    await page.waitForTimeout(1500); // allow client effect to pick static mode
    await expect(page.locator("canvas")).toHaveCount(0);
  });
});

test.describe("auth redirects", () => {
  test("signin page renders", async ({ request }) => {
    const r = await request.get("/auth/signin");
    expect(r.status()).toBe(200);
  });

  for (const path of ["/client/dashboard", "/admin/clients"]) {
    test(`unauthenticated ${path} redirects to signin`, async ({ request }) => {
      const r = await request.get(path, { maxRedirects: 0 });
      expect([302, 307]).toContain(r.status());
      expect(new URL(r.headers()["location"], "http://localhost").pathname).toBe("/auth/signin");
    });
  }
});
