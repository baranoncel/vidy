"use client";

import { use, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function LoginClient({ searchParamsPromise }: { searchParamsPromise: Promise<{ redirect?: string }> }) {
  const params = use(searchParamsPromise);
  const redirect = params.redirect || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function signInGoogle() {
    setBusy(true);
    try {
      await authClient.signIn.social({ provider: "google", callbackURL: redirect });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setBusy(false);
    }
  }

  async function signInEmail(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await authClient.signIn.email({ email, password, callbackURL: redirect });
      if (res.error) throw new Error(res.error.message || "Sign in failed");
      window.location.href = redirect;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">Sign in</h1>
      <p className="mb-8 text-sm text-neutral-500">Welcome back. Sign in to continue creating with Vidy.</p>

      <Button onClick={signInGoogle} disabled={busy} variant="outline" className="mb-6 w-full">
        Continue with Google
      </Button>

      <div className="mb-6 flex items-center gap-3 text-xs text-neutral-500">
        <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
        OR
        <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
      </div>

      <form onSubmit={signInEmail} className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-neutral-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-violet-500 dark:border-neutral-800"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-neutral-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-violet-500 dark:border-neutral-800"
          required
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" disabled={busy} className="w-full">
          {busy ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-neutral-500">
        New to Vidy?{" "}
        <a href="/register" className="font-medium text-violet-600 dark:text-violet-400">
          Create an account
        </a>
      </p>
    </main>
  );
}
