"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuthGate } from "@/components/auth/AuthGate";
import { uploadToR2 } from "./useJob";

/**
 * Drop-in submit hook for the existing feature pages. Auth-gates the
 * submit, uploads any File/Blob inputs to R2 first, hits
 * /api/feature/<feature>, polls /api/jobs/<id>/stream, and exposes a
 * normalized result.
 *
 * Usage in a page:
 *   const fr = useFeatureRun("video");
 *   await fr.run({ prompt, model: selectedModel, durationSeconds: duration });
 *   // fr.status, fr.outputUrl, fr.estCoins, fr.finalCoins, fr.error
 */
export type FeatureRunStatus = "idle" | "uploading" | "queued" | "running" | "completed" | "failed";

export type FeatureRunInput = Record<string, unknown>;

export type FeatureRunState = {
  status: FeatureRunStatus;
  jobId: string | null;
  outputUrl: string | null;
  outputJson: unknown;
  estCoins: number | null;
  finalCoins: number | null;
  errorMessage: string | null;
  modelSlug: string | null;
};

const INITIAL: FeatureRunState = {
  status: "idle",
  jobId: null,
  outputUrl: null,
  outputJson: null,
  estCoins: null,
  finalCoins: null,
  errorMessage: null,
  modelSlug: null,
};

export function useFeatureRun(feature: string) {
  const { requireAuth } = useAuthGate();
  const [state, setState] = useState<FeatureRunState>(INITIAL);
  const evtRef = useRef<EventSource | null>(null);

  // close stream on unmount
  useEffect(() => () => {
    if (evtRef.current) evtRef.current.close();
  }, []);

  const reset = useCallback(() => {
    if (evtRef.current) {
      evtRef.current.close();
      evtRef.current = null;
    }
    setState(INITIAL);
  }, []);

  /**
   * `input` may contain File/Blob values for keys ending with `File` or `Url`
   * (we'll auto-upload Files to R2 and pass back the public URL).
   * `modelSlug` (optional): override the default model.
   */
  const run = useCallback(
    async (
      input: FeatureRunInput,
      opts: { modelSlug?: string } = {},
    ): Promise<FeatureRunState> => {
      const result = await requireAuth(async () => {
        // 1) Upload any File values to R2.
        setState((s) => ({ ...s, status: "uploading", errorMessage: null }));
        const resolved: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(input)) {
          if (v instanceof File) {
            try {
              const { publicUrl } = await uploadToR2(v);
              resolved[k] = publicUrl;
            } catch (err) {
              const msg = err instanceof Error ? err.message : "Upload failed";
              setState((s) => ({ ...s, status: "failed", errorMessage: msg }));
              throw new Error(msg);
            }
          } else if (Array.isArray(v) && v.every((x) => x instanceof File)) {
            const urls: string[] = [];
            for (const file of v as File[]) {
              try {
                const { publicUrl } = await uploadToR2(file);
                urls.push(publicUrl);
              } catch (err) {
                const msg = err instanceof Error ? err.message : "Upload failed";
                setState((s) => ({ ...s, status: "failed", errorMessage: msg }));
                throw new Error(msg);
              }
            }
            resolved[k] = urls;
          } else {
            resolved[k] = v;
          }
        }

        // 2) Submit job.
        setState((s) => ({ ...s, status: "queued" }));
        const res = await fetch(`/api/feature/${feature}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input: resolved, modelSlug: opts.modelSlug }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          const msg = data.error || `Submit failed (${res.status})`;
          setState((s) => ({ ...s, status: "failed", errorMessage: msg }));
          throw new Error(msg);
        }

        const next: FeatureRunState = {
          ...INITIAL,
          status: data.status === "running" ? "running" : "queued",
          jobId: data.jobId,
          estCoins: data.estCoins ?? null,
          modelSlug: data.modelSlug ?? null,
        };
        setState(next);

        // 3) Open SSE stream.
        return await new Promise<FeatureRunState>((resolve) => {
          if (evtRef.current) evtRef.current.close();
          const es = new EventSource(`/api/jobs/${data.jobId}/stream`);
          evtRef.current = es;
          let snapshot = next;
          es.addEventListener("update", (ev) => {
            try {
              const u = JSON.parse((ev as MessageEvent).data);
              snapshot = {
                ...snapshot,
                status: (u.status as FeatureRunStatus) ?? snapshot.status,
                outputUrl: u.outputUrl ?? snapshot.outputUrl,
                finalCoins: u.finalCoins ?? snapshot.finalCoins,
                errorMessage: u.errorMessage ?? snapshot.errorMessage,
              };
              setState(snapshot);
            } catch {}
          });
          es.addEventListener("done", () => {
            es.close();
            evtRef.current = null;
            resolve(snapshot);
          });
          es.addEventListener("error", () => {
            // server closes after done; harmless
          });
        });
      });
      return result ?? state;
    },
    // requireAuth + state are stable; feature is fixed per hook instance
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [feature, requireAuth],
  );

  return { ...state, run, reset };
}

/**
 * Same shape but talks to `/api/agent/runs` for multi-step pipelines (UGC promo,
 * dubbing, stories, clips, podcast→shorts, etc).
 */
export function useAgentRun(templateId?: string) {
  const { requireAuth } = useAuthGate();
  const [state, setState] = useState<FeatureRunState>(INITIAL);
  const evtRef = useRef<EventSource | null>(null);

  useEffect(() => () => {
    if (evtRef.current) evtRef.current.close();
  }, []);

  const run = useCallback(
    async (input: FeatureRunInput, opts: { prompt?: string; templateId?: string } = {}) => {
      return requireAuth(async () => {
        setState((s) => ({ ...s, status: "uploading", errorMessage: null }));
        const resolved: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(input)) {
          if (v instanceof File) {
            const { publicUrl } = await uploadToR2(v);
            resolved[k] = publicUrl;
          } else if (Array.isArray(v) && v.every((x) => x instanceof File)) {
            const urls: string[] = [];
            for (const file of v as File[]) {
              const { publicUrl } = await uploadToR2(file);
              urls.push(publicUrl);
            }
            resolved[k] = urls;
          } else {
            resolved[k] = v;
          }
        }

        setState((s) => ({ ...s, status: "queued" }));
        const res = await fetch("/api/agent/runs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: opts.prompt || "",
            templateId: opts.templateId ?? templateId,
            inputs: resolved,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          const msg = data.error || `Agent submit failed (${res.status})`;
          setState((s) => ({ ...s, status: "failed", errorMessage: msg }));
          throw new Error(msg);
        }
        const next: FeatureRunState = {
          ...INITIAL,
          status: "running",
          jobId: data.runId,
          estCoins: data.plan?.totalEstCoins ?? null,
          modelSlug: opts.templateId ?? templateId ?? null,
        };
        setState(next);

        if (evtRef.current) evtRef.current.close();
        const es = new EventSource(`/api/agent/runs/${data.runId}/stream`);
        evtRef.current = es;
        let snapshot = next;
        es.addEventListener("update", (ev) => {
          try {
            const u = JSON.parse((ev as MessageEvent).data);
            snapshot = {
              ...snapshot,
              status: u.status === "completed" ? "completed" : u.status === "failed" ? "failed" : "running",
              outputUrl: u.finalOutputUrl ?? snapshot.outputUrl,
              outputJson: u.steps ?? snapshot.outputJson,
              errorMessage: u.errorMessage ?? snapshot.errorMessage,
            };
            setState(snapshot);
          } catch {}
        });
        es.addEventListener("done", () => {
          es.close();
          evtRef.current = null;
        });
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [requireAuth, templateId],
  );

  return { ...state, run };
}
