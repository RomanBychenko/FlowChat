import fs from 'fs';
import readline from 'readline';

export async function* streamLogs(filePath) {
    const stream = fs.createReadStream(filePath, {
        encoding: 'utf-8'
    });

    const rl = readline.createInterface({
        input: stream,
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        yield line;
    }
}