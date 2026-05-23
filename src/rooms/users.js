const users = [];

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

export function removeUser(socket) {
    const index = users.findIndex(
        (user) => user.socket === socket
    );

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }

    return null;
}

export function getUsers() {
    return users;
}

export function getUsersCount() {
    return users.length;
}

export function findUserBySocket(socket) {
    return users.find(
        (user) => user.socket === socket
    );
}

export function updateUserActivity(socket) {
    const user = findUserBySocket(socket);

    if (user) {
        user.lastActivity = Date.now();
    }
}

export function getInactiveUsers(timeout = 300000) {
    const now = Date.now();

    return users.filter(
        (user) => now - user.lastActivity > timeout
    );
}

export function removeInactiveUsers(timeout = 300000) {
    const inactiveUsers = getInactiveUsers(timeout);

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