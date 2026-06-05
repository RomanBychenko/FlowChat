// повертає поточний час у форматі HH:MM
export function getCurrentTime() {

    const now = new Date();

    return now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });
}