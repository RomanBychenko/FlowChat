const users = [];

export function addUser(username, socket) {
  users.push({
    username,
    socket
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