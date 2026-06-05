// імпортуємо клас EventEmitter з Node.js
import EventEmitter from 'events';

// створюємо єдиний об'єкт для роботи з подіями чату
const chatEventBus = new EventEmitter();

// експортуємо його для використання в інших файлах
export default chatEventBus;