"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FaqItem } from "@/lib/seo";

export function FaqSection({ items, heading = "Frequently asked questions" }: { items: FaqItem[]; heading?: string }) {
  if (!items.length) return null;
  return (
    <section className="mx-auto mt-16 max-w-3xl px-4">
      <h2 className="mb-6 text-2xl font-semibold tracking-tight">{heading}</h2>
      <ul className="divide-y divide-neutral-200 dark:divide-neutral-800">
        {items.map((it, i) => (
          <FaqRow key={i} item={it} />
        ))}
      </ul>
    </section>
  );
}

function FaqRow({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(false);
  return (
    <li>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 py-4 text-left"
        aria-expanded={open}
      >
        <span className="font-medium">{item.q}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <p className="pb-4 text-sm text-neutral-500">{item.a}</p>}
    </li>
  );
}
