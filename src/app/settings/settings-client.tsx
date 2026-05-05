"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

type LedgerRow = {
  id: string;
  delta: number;
  reason: string;
  createdAt: string;
  notes: string | null;
  modelSlug: string | null;
};

export function SettingsClient({
  user,
  ledger,
}: {
  user: { name?: string | null; email: string; plan: string };
  ledger: LedgerRow[];
}) {
  const [busy, setBusy] = useState(false);

  async function openPortal() {
    setBusy(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error || "Portal unavailable");
    } finally {
      setBusy(false);
    }
  }

  async function logOut() {
    await authClient.signOut();
    window.location.href = "/";
  }

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-neutral-200 p-5 dark:border-neutral-800">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">Account</h3>
        <p className="text-sm">{user.name}</p>
        <p className="text-sm text-neutral-500">{user.email}</p>
        <p className="mt-3 inline-flex rounded-full bg-violet-500/10 px-2 py-0.5 text-xs font-medium text-violet-600 dark:text-violet-400">
          Plan: {user.plan}
        </p>
        <div className="mt-4 flex gap-2">
          <Button variant="outline" onClick={openPortal} disabled={busy}>
            {busy ? "Opening…" : "Manage billing"}
          </Button>
          <Button variant="outline" onClick={logOut}>
            Sign out
          </Button>
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">Recent coin activity</h3>
        <ul className="divide-y divide-neutral-200 rounded-xl border border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
          {ledger.length === 0 && <li className="p-4 text-sm text-neutral-500">No activity yet.</li>}
          {ledger.map((row) => (
            <li key={row.id} className="flex items-center justify-between gap-3 p-4 text-sm">
              <div>
                <p className="font-medium">{row.reason}</p>
                <p className="text-xs text-neutral-500">
                  {new Date(row.createdAt).toLocaleString()}
                  {row.modelSlug ? ` · ${row.modelSlug.replace(/^fal-ai\//, "").replace(/\/.*$/, "")}` : ""}
                  {row.notes ? ` · ${row.notes}` : ""}
                </p>
              </div>
              <span className={row.delta >= 0 ? "font-semibold text-emerald-600" : "font-semibold text-red-500"}>
                {row.delta >= 0 ? "+" : ""}
                {row.delta.toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
