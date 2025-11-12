import type { CacheEntry } from "../types/cache.js";

// In-memory cache store
const cache = new Map<string, CacheEntry>();

// Cache configuration
const CACHE_DURATION_MS =
  process.env.NODE_ENV === "development" ? 10 * 60 * 1000 : 5 * 60 * 1000; // 10 minute dev, 5 minute prod

// Cache utility functions
export function getCacheKey(service: string, identifier: string): string {
  return `${service}_${identifier}`;
}

export function isCacheValid(entry: CacheEntry): boolean {
  return Date.now() < entry.expiresAt;
}

export function getCachedResponse(
  service: string,
  identifier: string,
): any | null {
  const key = getCacheKey(service, identifier);
  const entry = cache.get(key);

  if (entry && isCacheValid(entry)) {
    return entry.data;
  }

  // Remove expired entry
  if (entry) {
    cache.delete(key);
  }

  return null;
}

export function setCachedResponse(
  service: string,
  identifier: string,
  data: any,
): void {
  const key = getCacheKey(service, identifier);
  const now = Date.now();

  cache.set(key, {
    data,
    timestamp: now,
    expiresAt: now + CACHE_DURATION_MS,
  });
}

export function clearCache(): number {
  const clearedCount = cache.size;
  cache.clear();
  return clearedCount;
}

export function getCacheStatus() {
  const validEntries = Array.from(cache.entries()).filter(([_, entry]) =>
    isCacheValid(entry),
  );
  const expiredEntries = Array.from(cache.entries()).filter(
    ([_, entry]) => !isCacheValid(entry),
  );

  return {
    totalEntries: cache.size,
    validEntries: validEntries.length,
    expiredEntries: expiredEntries.length,
    cacheDuration: CACHE_DURATION_MS,
    environment: process.env.NODE_ENV,
  };
}

export function getCacheEntry(
  service: string,
  identifier: string,
): CacheEntry | undefined {
  const key = getCacheKey(service, identifier);
  return cache.get(key);
}
