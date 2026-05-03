import { WebSocketServer } from 'ws';
import {
  addUser,
  removeUser,
  getUsers
} from './rooms/users.js';
import { messageIdGenerator } from './utils/messageId.js';

const PORT = 8080;
const messageIds = messageIdGenerator();

// створення realtime серверу
const wss = new WebSocketServer({
  port: PORT
});

console.log(`WebSocket server running on port ${PORT}`);

// спрацьовує коли користувач підключається
wss.on('connection', (socket) => {
  console.log('New client connected');

    // коли приходить повідомлення
  socket.on('message', (rawMessage) => {
    const data = JSON.parse(rawMessage);

    if (data.type === 'join') {
      addUser(data.username, socket);

      console.log(`${data.username} joined chat`);

      broadcastMessage({
        type: 'system',
        text: `${data.username} joined the chat`
      });

      return;
    }

    if (data.type === 'message') {
      console.log(`${data.username}: ${data.text}`);

      broadcastMessage({
        id: messageIds.next().value,
         type: 'message',
        username: data.username,
        text: data.text
      });
    }
  });

  socket.on('close', () => {
    removeUser(socket);

    console.log('Client disconnected');
  });
});

function broadcastMessage(message) {
  const users = getUsers();

  for (const user of users) {
    user.socket.send(JSON.stringify(message));
  }
}