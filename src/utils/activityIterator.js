// генератор для послідовного перебору користувачів
export function* activityIterator(users) {

  let index = 0;

  while (index < users.length) {

    // повертає одного користувача за раз
    yield users[index];

    index++;
  }
}