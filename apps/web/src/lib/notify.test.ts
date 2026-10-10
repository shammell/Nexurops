import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { formatLeadAlert, notifyNewLead } from "./notify";

const lead = { name: "Ada", email: "ada@example.com", company: "Acme", service: "AI agents", message: "Need an agent." };
const realFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = realFetch;
  delete process.env.LEAD_ALERT_WEBHOOK_URL;
});

describe("lead alerts", () => {
  it("formats name, email, company, service and message, skipping empty fields", () => {
    const text = formatLeadAlert({ ...lead, service: null });
    assert.match(text, /New lead: Ada <ada@example.com>/);
    assert.match(text, /Company: Acme/);
    assert.doesNotMatch(text, /Service:/);
    assert.match(text, /Need an agent\./);
  });

  it("is a no-op without LEAD_ALERT_WEBHOOK_URL", async () => {
    let called = false;
    globalThis.fetch = (async () => {
      called = true;
      return new Response(null);
    }) as typeof fetch;
    await notifyNewLead(lead);
    assert.equal(called, false);
  });

  it("posts Discord/Slack-compatible JSON to the webhook", async () => {
    process.env.LEAD_ALERT_WEBHOOK_URL = "https://hooks.example.test/x";
    let body: any;
    globalThis.fetch = (async (_url: string, init: RequestInit) => {
      body = JSON.parse(init.body as string);
      return new Response(null, { status: 204 });
    }) as typeof fetch;
    await notifyNewLead(lead);
    assert.match(body.content, /ada@example.com/);
    assert.equal(body.text, body.content);
  });

  it("never throws when the webhook fails", async () => {
    process.env.LEAD_ALERT_WEBHOOK_URL = "https://hooks.example.test/x";
    globalThis.fetch = (async () => {
      throw new Error("network down");
    }) as typeof fetch;
    await assert.doesNotReject(notifyNewLead(lead));
  });
});
