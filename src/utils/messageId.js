// генератор унікальних ID повідомлень
export function* messageIdGenerator() {

  let id = 1;

  while (true) {

    // повертаємо поточний ID
    yield id++;
  }
}