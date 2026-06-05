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


// обгортаємо асинхронну модерацію декоратором логування
const loggedModerateMessage =
    loggerDecorator(
        moderateMessage,
        'ERROR'
    );

const PORT = 8080;
// генератор унікальних ID повідомлень
const messageIds = messageIdGenerator();

// створення realtime серверу
const server = http.createServer(app);

const wss = new WebSocketServer({
    server
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
// запуск сервісу очищення неактивних користувачів
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
      // перевірка коректності імені користувача
      if (!validateUsername(data.username)) {

        socket.send(JSON.stringify({
          type: 'system',
          text: 'Username must contain at least 3 characters',
          time: getCurrentTime()
        }));

        return;
      }
      // додаємо користувача до системи та кімнати
      addUser(
      data.username,
      socket,
      data.room
    );

    addUserToRoom(data.room, {
      username: data.username,
      socket
    });

    // очищаємо кеш статистики після змін у кімнатах
    clearRoomStatsCache();

      // генеруємо подію входу користувача
      chatEventBus.emit('user:join', data.username);

      // зберігаємо повідомлення в кеш
      addMessageToCache({
        username: data.username,
        text: data.text,
        room: data.room
      });

      // надсилаємо системне повідомлення всім у кімнаті
      loggedBroadcastMessage(data.room, {
        type: 'system',
        text: `${data.username} joined the room`,
        time: getCurrentTime()
      });

      // оновлюємо список користувачів та статистику кімнати
      loggedUpdateRoomData(data.room);

      const cachedMessages =
        getMessageCache();

      // відправляємо новому користувачу кеш останніх повідомлень
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
      // перевірка коректності повідомлення
      if (!validateMessage(data.text)) {

        socket.send(JSON.stringify({
          type: 'system',
          text: 'Invalid message',
          time: getCurrentTime()
        }));

        return;
      }

      // оновлюємо час останньої активності користувача
      updateUserActivity(socket);

      // модерація повідомлення через async функцію
      const moderationResult =
          await loggedModerateMessage(data.text);

      // повідомлення заблоковане модерацією
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

      // генеруємо подію нового повідомлення
      chatEventBus.emit('message:new', {
          username: data.username,
          text: data.text
      });

      addMessageToCache({
          username: data.username,
          text: data.text,
          room: data.room
      });

      // розсилаємо повідомлення всім користувачам кімнати
      loggedBroadcastMessage(data.room, {
        id: messageIds.next().value,
        type: 'message',
        username: data.username,
        text: data.text,
        time: getCurrentTime()
      });
    }
});

  // користувач відключився
  socket.on('close', () => {
    const user = findUserBySocket(socket);

    if (!user) {
      return;
    }

    // видаляємо користувача з кімнати та системи
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

// функція розсилки повідомлень усім користувачам кімнати
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

// декоратор логування для відправки повідомлень
const loggedBroadcastMessage =
    loggerDecorator(
        broadcastMessage,
        'INFO'
    );

// оновлення списку користувачів та статистики кімнати
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

        // кешуємо статистику кімнат для зменшення навантаження
        setRoomStatsCache(
            'room-stats',
            getRoomStats()
        );
    }
}

// декоратор логування для оновлення статистики
const loggedUpdateRoomData =
    loggerDecorator(
        updateRoomData,
        'DEBUG'
    );