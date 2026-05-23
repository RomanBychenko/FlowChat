export function validateUsername(username) {

    if (!username) {
        return false;
    }

    if (username.trim().length < 3) {
        return false;
    }

    return true;
}

export function validateMessage(message) {

    if (!message) {
        return false;
    }

    if (message.trim().length === 0) {
        return false;
    }

    if (message.length > 300) {
        return false;
    }

    return true;
}