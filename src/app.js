import express from 'express';
import { getUsers } from './rooms/users.js';
import { getRoomStats } from './rooms/rooms.js';
import { getMessageCache } from './cache/messageCache.js';
import { streamLogs } from './utils/logStream.js';
import {
    authMiddleware
} from './middleware/authMiddleware.js';

const app = express();

// роздача статичних файлів із папки public
app.use(express.static('public'));

// API для отримання статистики сервера
app.get(
    '/api/stats',
    authMiddleware,
    (req, res) => {

        res.json({
            onlineUsers: getUsers().length,
            stats: getRoomStats()
        });

    }
);

// API для отримання кешу повідомлень
app.get(
    '/api/messages',
    authMiddleware,
    (req, res) => {

        res.json(
            getMessageCache()
        );

    }
);

// API для перегляду останніх логів сервера
app.get(
    '/api/logs',
    authMiddleware,
    async (req, res) => {

        const logs = [];

        // читаємо лог-файл через async iterator та stream
        for await (
            const line of streamLogs('./logs/chat.log')
        ) {

            logs.push(line);

            // повертаємо максимум 50 рядків
            if (logs.length >= 50) {
                break;
            }
        }

        res.json(logs);

    }
);

export default app;