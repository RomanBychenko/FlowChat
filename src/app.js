import express from 'express';
import { getUsers } from './rooms/users.js';
import { getRoomStats } from './rooms/rooms.js';
import { getMessageCache } from './cache/messageCache.js';

const app = express();

app.use(express.static('public'));

app.get('/api/stats', (req, res) => {

    res.json({
        onlineUsers: getUsers().length,
        stats: getRoomStats()
    });
});

app.get('/api/messages', (req, res) => {

    res.json(
        getMessageCache()
    );
});

export default app;