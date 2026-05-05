"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { FeatureKey } from "../feature-models";

export type JobUpdate = {
  status: "queued" | "running" | "completed" | "failed" | "cancelled";
  outputUrl?: string | null;
  errorMessage?: string | null;
  estCoins?: number;
  finalCoins?: number | null;
};

export type SubmitJobBody = {
  feature: FeatureKey;
  modelSlug?: string;
  input: Record<string, unknown>;
};

export function useJob() {
  const [jobId, setJobId] = useState<string | null>(null);
  const [update, setUpdate] = useState<JobUpdate | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);
  const evtRef = useRef<EventSource | null>(null);

  const submit = useCallback(async (body: SubmitJobBody) => {
    setSubmitting(true);
    setError(null);
    setUpdate(null);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submit failed");
      setJobId(data.jobId);
      setUpdate({ status: data.status, estCoins: data.estCoins });
      return data as { jobId: string; estCoins: number; modelSlug: string; status: "queued" | "running" };
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submit failed");
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, []);

  useEffect(() => {
    if (!jobId) return;
    const es = new EventSource(`/api/jobs/${jobId}/stream`);
    evtRef.current = es;
    es.addEventListener("update", (e) => {
      try {
        setUpdate(JSON.parse((e as MessageEvent).data));
      } catch {}
    });
    es.addEventListener("done", () => {
      es.close();
      evtRef.current = null;
    });
    es.addEventListener("error", () => {
      // The server closes the stream when done; the EventSource error fires on close too.
    });
    return () => {
      es.close();
      evtRef.current = null;
    };
  }, [jobId]);

  const reset = useCallback(() => {
    if (evtRef.current) {
      evtRef.current.close();
      evtRef.current = null;
    }
    setJobId(null);
    setUpdate(null);
    setError(null);
  }, []);

  return { submit, jobId, update, error, isSubmitting, reset };
}

/**
 * Upload a Blob/File directly to R2 via presigned URL. Returns the public URL
 * to pass into a job submit.
 */
export async function uploadToR2(file: File): Promise<{ publicUrl: string; key: string }> {
  const ext = (file.name.split(".").pop() || "bin").toLowerCase();
  const presign = await fetch("/api/uploads/presign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ext, contentType: file.type || "application/octet-stream" }),
  }).then((r) => r.json());
  if (!presign.uploadUrl) throw new Error(presign.error || "presign failed");
  const put = await fetch(presign.uploadUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type || "application/octet-stream" },
  });
  if (!put.ok) throw new Error(`upload failed: ${put.status}`);
  return { publicUrl: presign.publicUrl as string, key: presign.key as string };
}
