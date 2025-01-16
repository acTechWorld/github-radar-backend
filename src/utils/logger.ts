import { existsSync } from "fs"
import path from "path";
import fs from "fs"

const logsDir = path.join(__dirname, '../logs');
const logsFile = path.join(logsDir, 'logs.txt');

const ensureLogsFile = () => {
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir); // Create logs directory if it doesn't exist
    }
    if (!fs.existsSync(logsFile)) {
        fs.writeFileSync(logsFile, ''); // Create logs.txt if it doesn't exist
    }
}

const log = (type: 'INFO' | 'ERROR', message: string) => {
    ensureLogsFile(); // Ensure file exists before appending
    const timestamp = new Date().toISOString();
    const logLine = `${timestamp} - ${type}:${message}\n`;
    fs.appendFileSync(logsFile, logLine, 'utf8');
}

export default {log}