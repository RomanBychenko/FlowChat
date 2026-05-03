export function* messageIdGenerator() {
  let id = 1;

  while (true) {
    yield id++;
  }
}