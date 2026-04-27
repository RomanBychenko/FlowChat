import { WebSocketServer } from 'ws';

const PORT = 8080;

// створення realtime серверу
const wss = new WebSocketServer({
  port: PORT
});

console.log(`WebSocket server running on port ${PORT}`);

// спрацьовує коли користувач підключається
wss.on('connection', (socket) => {
  console.log('New client connected');

  socket.send('Connected to FlowChat server');

  // коли приходить повідомлення
  socket.on('message', (message) => {
    console.log('Received:', message.toString());

    // відправка повідомлення назад клієнту
    socket.send(`Server received: ${message}`);
  });

  socket.on('close', () => {
    console.log('Client disconnected');
  });
});