import fs from 'fs';

export function loggerDecorator(
    fn,
    level = 'INFO'
) {

    return async function (...args) {

        const timestamp =
            new Date().toISOString();

        const logMessage =
            `[${timestamp}] [${level}] ${fn.name} called\n`;

        fs.appendFileSync(
            './logs/chat.log',
            logMessage
        );

        try {

            const result =
                await fn(...args);

            fs.appendFileSync(
                './logs/chat.log',
                `[${timestamp}] [${level}] ${fn.name} success\n`
            );

            return result;

        } catch (error) {

            fs.appendFileSync(
                './logs/chat.log',
                `[${timestamp}] [ERROR] ${fn.name} failed: ${error.message}\n`
            );

            throw error;
        }
    };
}