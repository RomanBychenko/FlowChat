// API ключ для доступу до захищених маршрутів
const API_KEY = 'student-secret-key';

// виконує HTTP GET запит до API
export async function apiRequest(url) {

    const response = await fetch(url, {

        // автоматично додаємо ключ автентифікації
        headers: {
            'x-api-key': API_KEY
        }
    });

    return response.json();
}