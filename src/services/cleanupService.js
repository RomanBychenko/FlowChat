import {
  getUsers,
  removeUser
} from '../rooms/users.js';

import {
  removeUserFromRoom
} from '../rooms/rooms.js';

import { activityIterator }
  from '../utils/activityIterator.js';

const INACTIVE_TIME = 1000 * 60 * 5;

export function startCleanupService() {
  setInterval(() => {
    const users = getUsers();

    const iterator =
      activityIterator(users);

    for (const user of iterator) {
      const inactiveTime =
        Date.now() - user.lastActivity;

      if (inactiveTime > INACTIVE_TIME) {
        console.log(
          `${user.username} removed for inactivity`
        );

        user.socket.close();

        removeUserFromRoom(
          user.room,
          user.socket
        );

        removeUser(user.socket);
      }
    }
  }, 10000);
}