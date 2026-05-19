import { WebSocketServer } from 'ws';
import {
  addUser,
  removeUser,
  getUsers,
  findUserBySocket,
  updateUserActivity
} from './rooms/users.js';
import { messageIdGenerator } from './utils/messageId.js';
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

const PORT = 8080;
const messageIds = messageIdGenerator();

// створення realtime серверу
const wss = new WebSocketServer({
  port: PORT
});

console.log(`WebSocket server running on port ${PORT}`);
startCleanupService();

// спрацьовує коли користувач підключається
wss.on('connection', (socket) => {
  console.log('New client connected');

  // коли приходить повідомлення
  socket.on('message', async (rawMessage) => {
    const data = JSON.parse(rawMessage);

    if (data.type === 'join') {
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

      broadcastMessage(data.room, {
        type: 'system',
        text: `${data.username} joined the room`
      });

      updateRoomData(data.room);

      return;
    }

    if (data.type === 'message') {
      updateUserActivity(socket);
      const moderationResult =
        await moderateMessage(data.text);

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

      broadcastMessage(data.room, {
        id: messageIds.next().value,
        type: 'message',
        username: data.username,
        text: data.text
      });
    }
  });

  socket.on('close', () => {
      const user = findUserBySocket(socket);
  
      if (user) {
        removeUserFromRoom(
          user.room,
          socket
        );

        clearRoomStatsCache();
      
        broadcastMessage(user.room, {
          type: 'system',
          text: `${user.username} left the room`
        });

        updateRoomData(user.room);
      }
  
      removeUser(socket);
      removeUserFromRoom(
        user.room,
        socket
      );
  
      if (user) {
        chatEventBus.emit('user:left', user.username);
      }
    });
});

function broadcastMessage(roomName, message) {
  const users = getRoomUsers(roomName);

  for (const user of users) {
    user.socket.send(
      JSON.stringify(message)
    );
  }
}

function updateRoomData(roomName) {
  const cachedStats =
    getRoomStatsCache('room-stats');
  const users = getRoomUsers(roomName);

  const usernames = users.map((user) => {
    return user.username;
  });

  broadcastMessage(roomName, {
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