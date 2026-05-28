import http from 'http';
import app from './app.js';
import { WebSocketServer } from 'ws';
import {
  addUser,
  removeUser,
  getUsers,
  findUserBySocket,
  updateUserActivity
} from './rooms/users.js';
import { messageIdGenerator } from './utils/messageId.js';
import { getCurrentTime } from './utils/timeFormatter.js';
import {
    validateUsername,
    validateMessage
} from './utils/validation.js';
import './events/chatListeners.js';
import chatEventBus from './events/chatEventBus.js';
import {
  addUserToRoom,
  removeUserFromRoom,
  getRoomUsers,
  getRoomStats
} from './rooms/rooms.js';
import {
  startCleanupService
} from './services/cleanupService.js';
import {
  moderateMessage
} from './moderation/moderationService.js';
import {
  setRoomStatsCache,
  getRoomStatsCache,
  clearRoomStatsCache
} from './cache/roomStatsCache.js';
import {
  addMessageToCache
} from './cache/messageCache.js';
import {
  getMessageCache
} from './cache/messageCache.js';
import {
    loggerDecorator
} from './logger/loggerDecorator.js';


const loggedModerateMessage =
    loggerDecorator(
        moderateMessage,
        'ERROR'
    );

const PORT = 8080;
const messageIds = messageIdGenerator();

// створення realtime серверу
const server = http.createServer(app);

const wss = new WebSocketServer({
    server
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
startCleanupService();

// спрацьовує коли користувач підключається
wss.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('error', (error) => {
    console.log('Socket error:', error.message);
  });

  // коли приходить повідомлення
  socket.on('message', async (rawMessage) => {
    const data = JSON.parse(rawMessage);

    if (data.type === 'join') {
      if (!validateUsername(data.username)) {

        socket.send(JSON.stringify({
          type: 'system',
          text: 'Username must contain at least 3 characters',
          time: getCurrentTime()
        }));

        return;
      }
      addUser(
      data.username,
      socket,
      data.room
    );

    addUserToRoom(data.room, {
      username: data.username,
      socket
    });

    clearRoomStatsCache();

      chatEventBus.emit('user:join', data.username);

      addMessageToCache({
        username: data.username,
        text: data.text,
        room: data.room
      });

      loggedBroadcastMessage(data.room, {
        type: 'system',
        text: `${data.username} joined the room`,
        time: getCurrentTime()
      });

      loggedUpdateRoomData(data.room);

      const cachedMessages =
        getMessageCache();

      for (const message of cachedMessages) {
        if (message.room === data.room) {
          socket.send(JSON.stringify({
            type: 'message',
            username: message.username,
            text: message.text
          }));
        }
      }

      return;
    }

    if (data.type === 'message') {
      if (!validateMessage(data.text)) {

        socket.send(JSON.stringify({
          type: 'system',
          text: 'Invalid message',
          time: getCurrentTime()
        }));

        return;
      }

      updateUserActivity(socket);

      const moderationResult =
          await loggedModerateMessage(data.text);

      if (moderationResult.blocked) {

          chatEventBus.emit(
              'message:blocked',
              {
                username: data.username
              }
          );

          socket.send(JSON.stringify({
              type: 'system',
              text: moderationResult.reason
          }));

          return;
      }

      chatEventBus.emit('message:new', {
          username: data.username,
          text: data.text
      });

      addMessageToCache({
          username: data.username,
          text: data.text,
          room: data.room
      });

      loggedBroadcastMessage(data.room, {
        id: messageIds.next().value,
        type: 'message',
        username: data.username,
        text: data.text,
        time: getCurrentTime()
      });
    }
});

  socket.on('close', () => {
    const user = findUserBySocket(socket);

    if (!user) {
      return;
    }

    removeUserFromRoom(
      user.room,
      socket
    );

    removeUser(socket);

    clearRoomStatsCache();

    loggedBroadcastMessage(user.room, {
      type: 'system',
      text: `${user.username} left the room`,
      time: getCurrentTime()
    });

    loggedUpdateRoomData(user.room);

    chatEventBus.emit(
      'user:left',
      user.username
    );
  });  
});

function broadcastMessage(
    roomName,
    message
) {

    const users =
        getRoomUsers(roomName);

    for (const user of users) {

        user.socket.send(
            JSON.stringify(message)
        );
    }
}

const loggedBroadcastMessage =
    loggerDecorator(
        broadcastMessage,
        'INFO'
    );

function updateRoomData(roomName) {

    const cachedStats =
        getRoomStatsCache('room-stats');

    const users =
        getRoomUsers(roomName);

    const usernames =
        users.map((user) => {
            return user.username;
        });

    loggedBroadcastMessage(roomName, {
        type: 'roomData',
        users: usernames,
        online: users.length,
        stats: cachedStats || getRoomStats()
    });

    if (!cachedStats) {

        setRoomStatsCache(
            'room-stats',
            getRoomStats()
        );
    }
}

const loggedUpdateRoomData =
    loggerDecorator(
        updateRoomData,
        'DEBUG'
    );