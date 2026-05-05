import "server-only";
import { prisma } from "./db";

export const SIGNUP_BONUS_COINS = 500; // 50¢ trial

export async function getCoinBalance(userId: string): Promise<number> {
  const result = await prisma.coinLedger.aggregate({
    where: { userId },
    _sum: { delta: true },
  });
  return result._sum.delta ?? 0;
}

export async function hasCoins(userId: string, amount: number): Promise<boolean> {
  const balance = await getCoinBalance(userId);
  return balance >= amount;
}

export type LedgerReason =
  | "purchase"
  | "spend"
  | "refund"
  | "reconcile"
  | "bonus"
  | "adjust"
  | "signup"
  | "expire";

export type LedgerInput = {
  userId: string;
  delta: number;
  reason: LedgerReason;
  jobId?: string;
  agentRunId?: string;
  modelSlug?: string;
  falCostUsd?: number;
  stripeEventId?: string;
  notes?: string;
};

export async function postLedger(input: LedgerInput) {
  return prisma.coinLedger.create({ data: input });
}

/**
 * Atomically debit coins for a job. Throws if balance is insufficient.
 * Caller is responsible for recording the jobId once it's created.
 */
export async function debitCoinsOrThrow(
  userId: string,
  amount: number,
  meta: Omit<LedgerInput, "userId" | "delta" | "reason"> & { reason?: "spend" } = {},
): Promise<void> {
  if (amount <= 0) return;
  await prisma.$transaction(async (tx) => {
    const result = await tx.coinLedger.aggregate({
      where: { userId },
      _sum: { delta: true },
    });
    const balance = result._sum.delta ?? 0;
    if (balance < amount) {
      throw new InsufficientCoinsError(amount, balance);
    }
    await tx.coinLedger.create({
      data: { userId, delta: -amount, reason: "spend", ...meta },
    });
  });
}

export async function refundCoins(userId: string, amount: number, meta: Omit<LedgerInput, "userId" | "delta" | "reason"> = {}): Promise<void> {
  if (amount <= 0) return;
  await postLedger({ userId, delta: amount, reason: "refund", ...meta });
}

export async function reconcileCoins(
  userId: string,
  estCoins: number,
  finalCoins: number,
  meta: Omit<LedgerInput, "userId" | "delta" | "reason"> = {},
): Promise<void> {
  // est was already deducted as -estCoins. Post a delta to reach -finalCoins.
  // i.e. delta = estCoins - finalCoins (positive means we over-charged → refund).
  const delta = estCoins - finalCoins;
  if (delta === 0) return;
  await postLedger({ userId, delta, reason: "reconcile", ...meta });
}

export async function grantBonus(userId: string, amount: number, notes?: string) {
  return postLedger({ userId, delta: amount, reason: "bonus", notes });
}

export async function grantSignupBonus(userId: string) {
  const existing = await prisma.coinLedger.findFirst({
    where: { userId, reason: "signup" },
    select: { id: true },
  });
  if (existing) return null;
  return postLedger({ userId, delta: SIGNUP_BONUS_COINS, reason: "signup", notes: "welcome bonus" });
}

export class InsufficientCoinsError extends Error {
  constructor(public required: number, public balance: number) {
    super(`Insufficient coins: need ${required}, have ${balance}`);
    this.name = "InsufficientCoinsError";
  }
}
