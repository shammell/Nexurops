"use client";

import { signIn } from "next-auth/react";
import { useState, type FormEvent } from "react";

const input =
  "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-white/30 focus-visible:border-primary-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/40";

function safeCallback(): string {
  const raw = new URLSearchParams(window.location.search).get("callbackUrl") ?? "/client/dashboard";
  // Only same-origin relative paths: blocks open-redirect via ?callbackUrl=https://evil.com
  return raw.startsWith("/") && !raw.startsWith("//") ? raw : "/client/dashboard";
}

export default function SignInPage() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const f = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: String(f.get("email") ?? ""),
      password: String(f.get("password") ?? ""),
      redirect: false,
    });
    if (res?.ok) {
      window.location.assign(safeCallback());
      return;
    }
    setError("Invalid email or password.");
    setBusy(false);
  }

  return (
    <main className="dark flex min-h-screen items-center justify-center bg-[#05060a] px-6 text-foreground">
      <div className="w-full max-w-sm space-y-6 rounded-2xl border border-white/10 bg-card/50 p-8 backdrop-blur-md">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary-300">Client portal</p>
          <h1 className="mt-3 font-display text-3xl font-light">Sign in</h1>
        </div>
        <div className="grid gap-3">
          <button type="button" onClick={() => signIn("google", { callbackUrl: safeCallback() })} className="rounded-lg border border-white/10 py-2.5 text-sm hover:bg-white/5">
            Continue with Google
          </button>
          <button type="button" onClick={() => signIn("github", { callbackUrl: safeCallback() })} className="rounded-lg border border-white/10 py-2.5 text-sm hover:bg-white/5">
            Continue with GitHub
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-3">
          <input name="email" type="email" required autoComplete="username" placeholder="Email" className={input} />
          <input name="password" type="password" required autoComplete="current-password" placeholder="Password" className={input} />
          {error && (
            <p role="alert" className="text-sm text-red-400">
              {error}
            </p>
          )}
          <button type="submit" disabled={busy} className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50">
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
