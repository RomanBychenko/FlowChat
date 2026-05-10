const rooms = {};

export function createRoom(roomName) {
  if (!rooms[roomName]) {
    rooms[roomName] = [];
  }
}

export function addUserToRoom(roomName, user) {
  createRoom(roomName);

  rooms[roomName].push(user);
}

export function removeUserFromRoom(roomName, socket) {
  if (!rooms[roomName]) {
    return;
  }

  rooms[roomName] = rooms[roomName].filter((user) => {
    return user.socket !== socket;
  });
}

export function getRoomUsers(roomName) {
  return rooms[roomName] || [];
}

export function getRooms() {
  return rooms;
}