import { WebSocketServer } from 'ws';
import {
  addUser,
  removeUser,
  getUsers,
  findUserBySocket,
  removeUserFromRoom
} from './rooms/users.js';
import { messageIdGenerator } from './utils/messageId.js';
import './events/chatListeners.js';
import chatEventBus from './events/chatEventBus.js';


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

      chatEventBus.emit('user:join', data.username);

      broadcastMessage({
        type: 'system',
        text: `${data.username} joined the chat`
      });

      return;
    }

    if (data.type === 'message') {
      chatEventBus.emit('message:new', {
        username: data.username,
        text: data.text
      });

      broadcastMessage({
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
      
        broadcastMessage({
          type: 'system',
          text: `${user.username} left the chat`
        });
      }
  
      removeUser(socket);
  
      if (user) {
        chatEventBus.emit('user:left', user.username);
      }
    });
});

function broadcastMessage(message) {
  const users = getUsers();

  for (const user of users) {
    user.socket.send(JSON.stringify(message));
  }
}