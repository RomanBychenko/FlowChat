import { badWords } from './badWords.js';

// перевіряє повідомлення на наявність заборонених слів
export async function moderateMessage(text) {

  // імітація затримки зовнішнього сервісу модерації
  await simulateDelay();

  // переводимо текст у нижній регістр для коректного порівняння
  const lowerCaseText =
    text.toLowerCase();

  // перевіряємо кожне заборонене слово
  for (const word of badWords) {

    if (lowerCaseText.includes(word)) {

      // повідомлення заблоковане
      return {
        blocked: true,
        reason: `Message contains banned word: ${word}`
      };
    }
  }

  // якщо заборонених слів не знайдено
  return {
    blocked: false
  };
}

// імітує асинхронний запит до сервісу модерації
function simulateDelay() {

  return new Promise((resolve) => {

    setTimeout(() => {
      resolve();
    }, 300);

  });
}