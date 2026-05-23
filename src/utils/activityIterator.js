export function* activityIterator(users) {
  let index = 0;

  while (index < users.length) {
    yield users[index];
    index++;
  }
}