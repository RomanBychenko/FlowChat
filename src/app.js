import express from 'express';
import { getUsers } from './rooms/users.js';
import { getRoomStats } from './rooms/rooms.js';
import { getMessageCache } from './cache/messageCache.js';
import { streamLogs } from './utils/logStream.js';
import {
    authMiddleware
} from './middleware/authMiddleware.js';

const app = express();

app.use(express.static('public'));

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

app.get(
    '/api/messages',
    authMiddleware,
    (req, res) => {

        res.json(
            getMessageCache()
        );

    }
);

app.get(
    '/api/logs',
    authMiddleware,
    async (req, res) => {

        const logs = [];

        for await (
            const line of streamLogs('./logs/chat.log')
        ) {

            logs.push(line);

            if (logs.length >= 50) {
                break;
            }
        }

        res.json(logs);

    }
);

export default app;