import chatEventBus from './chatEventBus.js';
import { writeLog } from '../logger/logger.js';

chatEventBus.on('user:join', (username) => {
    const message = `[EVENT] ${username} joined`;

    console.log(message);

    writeLog(message);
});

chatEventBus.on('message:new', (message) => {
    const logMessage =
    `[EVENT] new message from ${message.username}`;

    console.log(logMessage);

    writeLog(logMessage);
});

chatEventBus.on('user:left', (username) => {
    const message = `[EVENT] ${username} left`;

    console.log(message);

    writeLog(message);
});

// on() - підписується на подію;  emit() - буде викликати listener'и