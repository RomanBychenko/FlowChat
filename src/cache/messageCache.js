// масив для збереження останніх повідомлень чату
const messages = [];

// максимальна кількість повідомлень у кеші
const MAX_CACHE_SIZE = 50;

// додає нове повідомлення в кеш
export function addMessageToCache(message) {

  // записуємо повідомлення в масив
  messages.push(message);

  // якщо кількість повідомлень перевищила ліміт
  if (messages.length > MAX_CACHE_SIZE) {

    // видаляємо найстаріше повідомлення
    messages.shift();
  }
}

// повертає всі повідомлення з кешу
export function getMessageCache() {
  return messages;
}

// messages[] зберігає: останні 50 повідомлень
