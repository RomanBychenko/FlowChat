const messages = [];

const MAX_CACHE_SIZE = 50;

export function addMessageToCache(message) {
  messages.push(message);

  if (messages.length > MAX_CACHE_SIZE) {
    messages.shift();
  }
}

export function getMessageCache() {
  return messages;
}

// messages[] зберігає: останні 50 повідомлень
// shift() видаляє старі повідомлення.