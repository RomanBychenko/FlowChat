import fs from 'fs';
import readline from 'readline';

// асинхронний генератор для читання логів пострічково
export async function* streamLogs(filePath) {

    // відкриваємо потік читання файлу
    const stream = fs.createReadStream(
        filePath,
        {
            encoding: 'utf-8'
        }
    );

    const rl = readline.createInterface({
        input: stream,
        crlfDelay: Infinity
    });

    // повертаємо рядки файлу по одному
    for await (const line of rl) {
        yield line;
    }
}