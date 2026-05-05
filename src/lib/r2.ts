import "server-only";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucket = process.env.R2_BUCKET_NAME;
const publicUrl = process.env.R2_PUBLIC_URL;

const configured = !!(accountId && accessKeyId && secretAccessKey && bucket);

const client = configured
  ? new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId: accessKeyId!, secretAccessKey: secretAccessKey! },
    })
  : null;

function assertConfigured() {
  if (!client || !bucket) {
    throw new Error("R2 is not configured. Set R2_* env vars.");
  }
}

export async function putToR2(
  key: string,
  body: Buffer | Uint8Array,
  contentType: string,
  cacheControl = "public, max-age=31536000",
): Promise<void> {
  assertConfigured();
  await client!.send(
    new PutObjectCommand({
      Bucket: bucket!,
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: cacheControl,
    }),
  );
}

export async function presignPut(key: string, contentType: string, expiresIn = 3600): Promise<string> {
  assertConfigured();
  const command = new PutObjectCommand({ Bucket: bucket!, Key: key, ContentType: contentType });
  return getSignedUrl(client!, command, { expiresIn });
}

export async function presignGet(key: string, expiresIn = 3600): Promise<string> {
  assertConfigured();
  const command = new GetObjectCommand({ Bucket: bucket!, Key: key });
  return getSignedUrl(client!, command, { expiresIn });
}

export function publicUrlFor(key: string): string {
  if (!publicUrl) throw new Error("R2_PUBLIC_URL not set");
  return `${publicUrl.replace(/\/$/, "")}/${key.replace(/^\//, "")}`;
}

export async function downloadToBuffer(url: string): Promise<{ buffer: Buffer; contentType: string }> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status}`);
  const arrayBuffer = await res.arrayBuffer();
  return {
    buffer: Buffer.from(arrayBuffer),
    contentType: res.headers.get("content-type") || "application/octet-stream",
  };
}

export function jobOutputKey(userId: string, jobId: string, ext: string): string {
  return `users/${userId}/jobs/${jobId}/output.${ext}`;
}

export function userUploadKey(userId: string, uploadId: string, ext: string): string {
  return `users/${userId}/uploads/${uploadId}.${ext}`;
}

export function agentOutputKey(userId: string, agentRunId: string, stepIndex: number, ext: string): string {
  return `users/${userId}/agents/${agentRunId}/step-${stepIndex}.${ext}`;
}

export function inferExtFromContentType(ct: string): string {
  const map: Record<string, string> = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/webp": "webp",
    "image/gif": "gif",
    "video/mp4": "mp4",
    "video/webm": "webm",
    "audio/mpeg": "mp3",
    "audio/wav": "wav",
    "audio/x-wav": "wav",
    "model/gltf-binary": "glb",
    "application/octet-stream": "bin",
  };
  return map[ct.toLowerCase()] || "bin";
}
