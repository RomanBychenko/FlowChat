// перевіряє коректність імені користувача
export function validateUsername(username) {

    if (!username) {
        return false;
    }

    // мінімум 3 символи
    if (username.trim().length < 3) {
        return false;
    }

    return true;
}

// перевіряє коректність повідомлення
export function validateMessage(message) {

    if (!message) {
        return false;
    }

    // заборона порожніх повідомлень
    if (message.trim().length === 0) {
        return false;
    }

    // обмеження довжини повідомлення
    if (message.length > 300) {
        return false;
    }

    return true;
}