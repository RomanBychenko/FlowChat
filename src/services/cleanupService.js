import {
  getUsers,
  removeUser
} from '../rooms/users.js';

import {
  removeUserFromRoom
} from '../rooms/rooms.js';

import {
  activityIterator
} from '../utils/activityIterator.js';

// максимальний час без активності (5 хвилин)
const INACTIVE_TIME = 1000 * 60 * 5;

// запускає сервіс автоматичного очищення неактивних користувачів
export function startCleanupService() {

  // перевірка виконується кожні 10 секунд
  setInterval(() => {

    const users = getUsers();

    // створюємо ітератор для обходу користувачів
    const iterator =
      activityIterator(users);

    // перебираємо всіх користувачів
    for (const user of iterator) {

      const inactiveTime =
        Date.now() - user.lastActivity;

      // якщо користувач неактивний більше 5 хвилин
      if (inactiveTime > INACTIVE_TIME) {

        console.log(
          `${user.username} removed for inactivity`
        );

        // закриваємо WebSocket-з'єднання
        user.socket.close();

        // видаляємо користувача з кімнати
        removeUserFromRoom(
          user.room,
          user.socket
        );

        // видаляємо користувача із загального списку
        removeUser(user.socket);
      }
    }
  }, 10000);
}