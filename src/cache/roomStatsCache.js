// створюємо Map для зберігання кешу статистики кімнат
const cache = new Map();

// записує значення в кеш
export function setRoomStatsCache(key, value) {

  // зберігаємо значення та час створення кешу
  cache.set(key, {
    value,
    createdAt: Date.now()
  });
}

// отримує значення з кешу
export function getRoomStatsCache(key) {

  const cachedValue = cache.get(key);

  // якщо кешу немає
  if (!cachedValue) {
    return null;
  }

  // визначаємо вік кешу в мілісекундах
  const cacheAge =
    Date.now() - cachedValue.createdAt;

  // час життя кешу (15 секунд)
  const CACHE_TTL = 1000 * 15;

  // якщо кеш застарів
  if (cacheAge > CACHE_TTL) {

    // видаляємо його
    cache.delete(key);

    return null;
  }

  // повертаємо збережене значення
  return cachedValue.value;
}

// очищає весь кеш
export function clearRoomStatsCache() {
  cache.clear();
}