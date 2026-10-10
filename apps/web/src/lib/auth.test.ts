import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isConfigured } from "./auth";

describe("OAuth provider config", () => {
  it("rejects unset, empty and dummy placeholder credentials", () => {
    assert.equal(isConfigured(undefined, "secret"), false);
    assert.equal(isConfigured("", "secret"), false);
    assert.equal(isConfigured("dummy", "dummy"), false);
    assert.equal(isConfigured("dummy-client-id", "real-secret"), false);
    assert.equal(isConfigured("real-id", "DUMMY-secret"), false);
  });

  it("accepts real-looking credentials", () => {
    assert.equal(isConfigured("123.apps.googleusercontent.com", "GOCSPX-abc"), true);
  });
});
