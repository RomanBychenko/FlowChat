import chatEventBus from './chatEventBus.js';

chatEventBus.on('user:join', (username) => {
  console.log(`[EVENT] ${username} joined`);
});

chatEventBus.on('message:new', (message) => {
  console.log(
    `[EVENT] new message from ${message.username}`
  );
});

chatEventBus.on('user:left', (username) => {
  console.log(`[EVENT] ${username} left`);
});

// on() - підписується на подію;  emit() - буде викликати listener'и