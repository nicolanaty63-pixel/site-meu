import "server-only";
import { Redis } from "@upstash/redis";
import { createHash } from "node:crypto";
import { REVIEW_RULES, type Review } from "@/lib/reviews-shared";

/**
 * Server-side review persistence + spam-protection state.
 *
 * Storage is Upstash Redis (serverless-native, REST). When its env vars are
 * absent (local dev without creds) we transparently fall back to a per-process
 * in-memory store so the full flow still works locally — production MUST set the
 * Upstash env vars or reviews won't persist or be shared between serverless
 * instances. A loud warning is logged in that case.
 *
 * Validation / types / rules live in `@/lib/reviews-shared` (isomorphic).
 */

export {
  REVIEW_RULES,
  validateReview,
  SERVICE_OPTIONS,
} from "@/lib/reviews-shared";
export type {
  Review,
  ReviewInput,
  ValidationResult,
} from "@/lib/reviews-shared";

const REVIEWS_KEY = "reviews:list";

const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const token =
  process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
const redis = url && token ? new Redis({ url, token }) : null;

let warnedNoRedis = false;
function memoryWarn() {
  if (!warnedNoRedis) {
    warnedNoRedis = true;
    console.warn(
      "[reviews] No Upstash Redis env vars found — using in-memory store. " +
        "Reviews will NOT persist or be shared. Set UPSTASH_REDIS_REST_URL/TOKEN in production.",
    );
  }
}

// ---- in-memory fallback (dev only) -----------------------------------------
const mem = {
  list: [] as Review[],
  rate: new Map<string, number[]>(), // ip -> submission timestamps (ms)
  dups: new Map<string, number>(), // hash -> expiry (ms)
};

function dupHash(name: string, text: string): string {
  return createHash("sha256")
    .update(`${name.toLowerCase()}|${text.toLowerCase()}`)
    .digest("hex")
    .slice(0, 32);
}

// ---- rate limiting ---------------------------------------------------------
export async function checkRateLimit(
  ip: string,
): Promise<{ ok: boolean; retryAfterSec?: number }> {
  const key = `reviews:rl:${ip}`;
  if (redis) {
    const n = await redis.incr(key);
    if (n === 1) await redis.expire(key, REVIEW_RULES.rateWindowSec);
    if (n > REVIEW_RULES.rateMax) {
      const ttl = await redis.ttl(key);
      return {
        ok: false,
        retryAfterSec: ttl > 0 ? ttl : REVIEW_RULES.rateWindowSec,
      };
    }
    return { ok: true };
  }
  memoryWarn();
  const now = Date.now();
  const windowMs = REVIEW_RULES.rateWindowSec * 1000;
  const hits = (mem.rate.get(ip) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= REVIEW_RULES.rateMax) {
    return {
      ok: false,
      retryAfterSec: Math.ceil((windowMs - (now - hits[0]!)) / 1000),
    };
  }
  hits.push(now);
  mem.rate.set(ip, hits);
  return { ok: true };
}

// ---- duplicate prevention --------------------------------------------------
export async function isDuplicate(
  name: string,
  text: string,
): Promise<boolean> {
  const key = `reviews:dup:${dupHash(name, text)}`;
  if (redis) {
    // SET NX returns "OK" when newly set, null when it already existed.
    const res = await redis.set(key, 1, {
      nx: true,
      ex: REVIEW_RULES.dupTtlSec,
    });
    return res === null;
  }
  memoryWarn();
  const now = Date.now();
  const exp = mem.dups.get(key);
  if (exp && exp > now) return true;
  mem.dups.set(key, now + REVIEW_RULES.dupTtlSec * 1000);
  return false;
}

// ---- read / write ----------------------------------------------------------
export async function listReviews(limit = 100): Promise<Review[]> {
  if (redis) {
    const rows = await redis.lrange<Review>(REVIEWS_KEY, 0, limit - 1);
    return rows.filter(Boolean);
  }
  memoryWarn();
  return mem.list.slice(0, limit);
}

export async function addReview(
  value: Omit<Review, "id" | "createdAt">,
): Promise<Review> {
  const review: Review = {
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    ...value,
  };
  if (redis) {
    await redis.lpush(REVIEWS_KEY, review); // newest first
    await redis.ltrim(REVIEWS_KEY, 0, REVIEW_RULES.maxStored - 1);
  } else {
    memoryWarn();
    mem.list.unshift(review);
    mem.list.length = Math.min(mem.list.length, REVIEW_RULES.maxStored);
  }
  return review;
}

export function isUsingMemoryStore(): boolean {
  return redis === null;
}
