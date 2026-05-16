import { badWords } from './badWords.js';

export async function moderateMessage(text) {
  await simulateDelay();

  const lowerCaseText =
    text.toLowerCase();

  for (const word of badWords) {
    if (lowerCaseText.includes(word)) {
      return {
        blocked: true,
        reason: `Message contains banned word: ${word}`
      };
    }
  }

  return {
    blocked: false
  };
}

function simulateDelay() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 300);
  });
}