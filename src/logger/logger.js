import fs from 'fs';

// записує повідомлення у файл логів
export function writeLog(message) {

  // отримуємо поточний час у форматі ISO
  const time = new Date().toISOString();

  // формуємо повний запис для логу
  const fullMessage =
    `[${time}] ${message}\n`;

  // додаємо запис у кінець файлу chat.log
  fs.appendFileSync(
    './logs/chat.log',
    fullMessage
  );
}