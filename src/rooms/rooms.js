// об'єкт для зберігання всіх кімнат та їх користувачів
const rooms = {};

// створює кімнату, якщо її ще не існує
export function createRoom(roomName) {

  if (!rooms[roomName]) {
    rooms[roomName] = [];
  }
}

// додає користувача в кімнату
export function addUserToRoom(roomName, user) {

  createRoom(roomName);

  rooms[roomName].push(user);
}

// видаляє користувача з кімнати при відключенні
export function removeUserFromRoom(roomName, socket) {

  if (!rooms[roomName]) {
    return;
  }

  rooms[roomName] = rooms[roomName].filter((user) => {
    return user.socket !== socket;
  });
}

// повертає всіх користувачів конкретної кімнати
export function getRoomUsers(roomName) {
  return rooms[roomName] || [];
}

// повертає всі створені кімнати
export function getRooms() {
  return rooms;
}

// формує статистику по всіх кімнатах
export function getRoomStats() {

  const result = [];

  for (const roomName in rooms) {

    result.push({
      room: roomName,
      online: rooms[roomName].length
    });
  }

  return result;
}