import fs from 'fs';

// decorator для логування викликів функцій
export function loggerDecorator(
    fn,
    level = 'INFO'
) {

    // повертає нову функцію-обгортку
    return async function (...args) {

        const timestamp =
            new Date().toISOString();

        // записує інформацію про початок виконання функції
        const logMessage =
            `[${timestamp}] [${level}] ${fn.name} called\n`;

        fs.appendFileSync(
            './logs/chat.log',
            logMessage
        );

        try {

            // викликаємо оригінальну функцію
            const result =
                await fn(...args);

            // лог успішного завершення
            fs.appendFileSync(
                './logs/chat.log',
                `[${timestamp}] [${level}] ${fn.name} success\n`
            );

            return result;

        } catch (error) {

            // логування помилки
            fs.appendFileSync(
                './logs/chat.log',
                `[${timestamp}] [ERROR] ${fn.name} failed: ${error.message}\n`
            );

            throw error;
        }
    };
}