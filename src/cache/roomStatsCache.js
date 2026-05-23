const cache = new Map();

export function setRoomStatsCache(key, value) {
  cache.set(key, {
    value,
    createdAt: Date.now()
  });
}

export function getRoomStatsCache(key) {
  const cachedValue = cache.get(key);

  if (!cachedValue) {
    return null;
  }

  const cacheAge =
    Date.now() - cachedValue.createdAt;

  const CACHE_TTL = 1000 * 15;

  if (cacheAge > CACHE_TTL) {
    cache.delete(key);

    return null;
  }

  return cachedValue.value;
}

export function clearRoomStatsCache() {
  cache.clear();
}