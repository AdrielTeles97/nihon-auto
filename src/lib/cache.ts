export interface CacheEntry<T> {
  value: T;
  expiry: number;
}

/**
 * Simple in-memory cache with TTL.
 * Used to avoid repeated requests to the same API endpoints.
 */
  export class SimpleCache {
    private store = new Map<string, CacheEntry<unknown>>();

  constructor(private defaultTtl = 5 * 60 * 1000) {}

    get<T>(key: string): T | null {
      const entry = this.store.get(key) as CacheEntry<T> | undefined;
      if (!entry) return null;
      if (Date.now() > entry.expiry) {
        this.store.delete(key);
        return null;
      }
      return entry.value;
    }

  set<T>(key: string, value: T, ttl = this.defaultTtl) {
    this.store.set(key, { value, expiry: Date.now() + ttl });
  }

  clear() {
    this.store.clear();
  }
}

export const cache = new SimpleCache();
