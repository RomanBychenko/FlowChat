// масив для зберігання всіх підключених користувачів
const users = [];

// додає нового користувача в систему
export function addUser(username, socket, room = 'general') {

    const user = {
        username,
        socket,
        room,
        joinedAt: Date.now(),
        lastActivity: Date.now()
    };

    users.push(user);

    return user;
}

// видаляє користувача по його socket-з'єднанню
export function removeUser(socket) {

    const index = users.findIndex(
        (user) => user.socket === socket
    );

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }

    return null;
}

// повертає список усіх користувачів
export function getUsers() {
    return users;
}

// повертає кількість користувачів онлайн
export function getUsersCount() {
    return users.length;
}

// знаходить користувача по socket
export function findUserBySocket(socket) {

    return users.find(
        (user) => user.socket === socket
    );
}

// оновлює час останньої активності користувача
export function updateUserActivity(socket) {

    const user = findUserBySocket(socket);

    if (user) {
        user.lastActivity = Date.now();
    }
}

// повертає список неактивних користувачів
export function getInactiveUsers(timeout = 300000) {

    const now = Date.now();

    return users.filter(
        (user) => now - user.lastActivity > timeout
    );
}

// видаляє користувачів, які довго не проявляли активність
export function removeInactiveUsers(timeout = 300000) {

    const inactiveUsers =
        getInactiveUsers(timeout);

    for (const inactiveUser of inactiveUsers) {

        const index = users.findIndex(
            (user) => user.socket === inactiveUser.socket
        );

        if (index !== -1) {
            users.splice(index, 1);
        }
    }

    return inactiveUsers;
}