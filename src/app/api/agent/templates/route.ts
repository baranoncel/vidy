import { NextResponse } from "next/server";
import { AGENT_TEMPLATES } from "@/lib/agent/templates";
import { withErrors } from "@/lib/api";

export const runtime = "nodejs";
export const revalidate = 60;

export const GET = withErrors(async () => {
  const items = AGENT_TEMPLATES.map((t) => ({
    id: t.id,
    displayName: t.displayName,
    description: t.description,
    category: t.category,
    expectedInputs: t.expectedInputs,
  }));
  return NextResponse.json({ templates: items, count: items.length });
});
