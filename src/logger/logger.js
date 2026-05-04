import fs from 'fs';

export function writeLog(message) {
  const time = new Date().toISOString();

  const fullMessage =
    `[${time}] ${message}\n`;

  fs.appendFileSync(
    './logs/chat.log',
    fullMessage
  );
}