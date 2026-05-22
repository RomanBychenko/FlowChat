# FlowChat

## Overview

FlowChat is a real-time chat application built with Node.js, Express and WebSocket.

The project was created as a final semester project that combines functionality and technologies from multiple laboratory works into one complete system.

Users can connect to the server, join chat rooms, exchange messages in real time, see online users and room statistics.

The application also includes message moderation, caching, logging, validation and automatic cleanup services.

---

# Main Features

- Real-time communication using WebSocket
- Multiple chat rooms
- Online users tracking
- Room statistics
- Message validation
- Message moderation
- Event-driven architecture
- Message caching
- Cleanup service
- Logging system
- Modular project structure

---

# Technologies Used

## Backend

- Node.js
- Express
- WebSocket (`ws`)

## Frontend

- HTML
- CSS
- Vanilla JavaScript

---

# How the Chat Works

## 1. User Connection

When a user opens the website, the frontend creates a WebSocket connection with the server.

```js
const socket = new WebSocket('ws://localhost:8080');
```

The server listens for new connections:

```js
wss.on('connection', (socket) => {
    console.log('New client connected');
});
```

---

## 2. Joining a Room

The user enters:

- username
- room name

After that the client sends a `join` event to the server.

Example:

```js
socket.send(JSON.stringify({
    type: 'join',
    username,
    room
}));
```

The server:

- validates username
- adds user to room
- updates room statistics
- broadcasts system message
- sends online users list

---

## 3. Sending Messages

When the user sends a message:

1. The frontend sends data through WebSocket
2. The server validates message
3. Message moderation checks forbidden content
4. Message is cached
5. Event system logs activity
6. Message is broadcasted to all users in room

---

## 4. Real-Time Updates

The server automatically updates:

- online users count
- users list
- room statistics
- new messages

without page reload.

---

# Project Structure

```bash
FlowChat/
│
├── public/
│   └── index.html
│
├── src/
│   ├── cache/
│   ├── events/
│   ├── logger/
│   ├── moderation/
│   ├── rooms/
│   ├── services/
│   ├── sockets/
│   ├── utils/
│   │
│   ├── app.js
│   └── server.js
│
├── logs/
├── package.json
└── README.md
```

---

# Laboratory Works Used in the Project

## Laboratory Work 1 — Node.js Basics

Used for:

- creating server
- project structure
- modules
- package management

Implemented in:

- `server.js`
- `app.js`

---

## Laboratory Work 2 — Express Server

Used for:

- HTTP server creation
- static files serving

Implemented in:

```js
app.use(express.static('public'));
```

---

## Laboratory Work 3 — WebSocket Communication

Main functionality of the project.

Used for:

- real-time messaging
- live updates
- client-server communication

Implemented in:

```js
const wss = new WebSocketServer({ server });
```

and:

```js
socket.on('message', ...)
```

---

## Laboratory Work 4 — Events System

Custom event system using EventEmitter.

Used for:

- user join events
- message events
- blocked message events

Implemented in:

- `events/chatEventBus.js`
- `events/chatListeners.js`

---

## Laboratory Work 5 — Validation

Validation system for:

- usernames
- messages

Implemented in:

- `utils/validation.js`

Example:

```js
validateUsername()
validateMessage()
```

---

## Laboratory Work 6 — Logging System

Logs important events into files.

Used for:

- connection logs
- messages logs
- moderation logs

Implemented in:

- `logger/`

---

## Laboratory Work 7 — Cache System

Caching room statistics and messages.

Used for:

- reducing repeated calculations
- faster room updates

Implemented in:

- `cache/messageCache.js`
- `cache/roomStatsCache.js`

---

## Laboratory Work 8 — Services and Cleanup

Background cleanup service.

Used for:

- removing inactive users
- clearing old data

Implemented in:

- `services/cleanupService.js`

---

## Laboratory Work 9 — Moderation System

Message moderation system.

Used for:

- blocked words filtering
- preventing forbidden messages

Implemented in:

- `moderation/moderationService.js`

---

# Installation

## Install dependencies

```bash
npm install
```

---

# Running the Project

Start server:

```bash
npm start
```

Server starts on:

```bash
http://localhost:8080
```

---

# How to Use

1. Open browser
2. Enter username
3. Enter room name
4. Join room
5. Send messages in real time

---

# Example Functionality

The application supports:

- multiple users
- multiple rooms
- live messaging
- online users display
- room statistics
- system notifications
- automatic moderation

---

# Future Improvements

Possible future improvements:

- authentication
- database support
- private messages
- REST API
- React frontend
- Docker support
- deployment to cloud server

---

# Author

Roman Bychenko

Semester Project — Real-Time Chat Application