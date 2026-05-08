const rooms = new Map();

export function createRoom(roomName) {
  if (!rooms.has(roomName)) {
    rooms.set(roomName, []);
  }
}

export function addUserToRoom(roomName, user) {
  const room = rooms.get(roomName);

  if (room) {
    room.push(user);
  }
}

export function removeUserFromRoom(roomName, socket) {
  const room = rooms.get(roomName);

  if (!room) {
    return;
  }

  const filteredUsers = room.filter((user) => {
    return user.socket !== socket;
  });

  rooms.set(roomName, filteredUsers);
}

export function getRoomUsers(roomName) {
  return rooms.get(roomName) || [];
}