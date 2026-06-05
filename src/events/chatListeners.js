import chatEventBus from './chatEventBus.js';
import { writeLog } from '../logger/logger.js';

// обробка події входу користувача в чат
chatEventBus.on('user:join', (username) => {
    const message = `[EVENT] ${username} joined`;

    console.log(message);

    writeLog(message);
});

// обробка події нового повідомлення
chatEventBus.on('message:new', (message) => {
    const logMessage =
    `[EVENT] new message from ${message.username}`;

    console.log(logMessage);

    writeLog(logMessage);
});

// обробка події виходу користувача з чату
chatEventBus.on('user:left', (username) => {
    const message = `[EVENT] ${username} left`;

    console.log(message);

    writeLog(message);
});

// обробка події блокування повідомлення модератором
chatEventBus.on(
  'message:blocked',
  (data) => {
    const message =
      `[MODERATION] blocked message from ${data.username}`;

    console.log(message);

    writeLog(message);
  }
);

// on() - підписка на подію
// emit() - виклик усіх обробників цієї події