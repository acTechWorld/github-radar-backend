import path from "path";
import fs from "fs";

const logsDir = process.env.LOGS_DIR || path.join(__dirname, '../logs');

// Ensure logs directory exists
const ensureLogsDir = () => {
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir); // Create logs directory if it doesn't exist
    }
};

// Generate the daily log file name
const getDailyLogFile = () => {
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    return path.join(logsDir, `logs-${today}.txt`);
};

// Clean up logs older than 30 days
const cleanOldLogs = () => {
    const now = Date.now();
    const cutoff = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

    // Read all files in the logs directory
    const files = fs.readdirSync(logsDir);

    files.forEach((file) => {
        const filePath = path.join(logsDir, file);
        const stats = fs.statSync(filePath);

        // Check if the file is older than 30 days
        if (now - stats.mtimeMs > cutoff) {
            fs.unlinkSync(filePath); // Delete the file
        }
    });
};

// Log a message
const log = (type: 'INFO' | 'ERROR' | 'DEBUG', message: string) => {
    ensureLogsDir(); // Ensure logs directory exists
    cleanOldLogs(); // Clean old logs

    const logFile = getDailyLogFile(); // Get today's log file
    const timestamp = new Date().toISOString();
    const logLine = `${timestamp} - ${type}: ${message}\n`;
    fs.appendFileSync(logFile, logLine, 'utf8'); // Append the log line

    // Console log only in development environment
    if (process.env.NODE_ENV === 'development') {
        console.log(logLine.trim());
    }
};

export default { log };
