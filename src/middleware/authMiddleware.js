// API ключ для доступу до захищених маршрутів
const API_KEY = 'student-secret-key';

// middleware для перевірки автентифікації
export function authMiddleware(
    req,
    res,
    next
) {

    // отримуємо API ключ із заголовка запиту
    const apiKey =
        req.headers['x-api-key'];

    // якщо ключ відсутній
    if (!apiKey) {
        return res.status(401).json({
            error: 'API key missing'
        });
    }

    // якщо ключ неправильний
    if (apiKey !== API_KEY) {
        return res.status(403).json({
            error: 'Invalid API key'
        });
    }

    // дозволяємо виконання наступного middleware або маршруту
    next();
}