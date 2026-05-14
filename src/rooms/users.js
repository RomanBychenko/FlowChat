const users = [];

export function addUser(username, socket, room) {
  users.push({
    username,
    socket,
    room,
    lastActivity: Date.now()
  });
}

export function removeUser(socket) {
  const index = users.findIndex((user) => {
    return user.socket === socket;
  });

  if (index !== -1) {
    users.splice(index, 1);
  }
}

export function getUsers() {
  return users;
}

export function findUserBySocket(socket) {
  return users.find((user) => {
    return user.socket === socket;
  });
}

export function removeUserFromRoom(socket) {
  const index = users.findIndex((user) => {
    return user.socket === socket;
  });

  if (index !== -1) {
    users.splice(index, 1);
  }
}

export function updateUserActivity(socket) {
  const user = users.find((user) => {
    return user.socket === socket;
  });

  if (user) {
    user.lastActivity = Date.now();
  }
}