"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const logsDir = path_1.default.join(__dirname, '../logs');
// Ensure logs directory exists
const ensureLogsDir = () => {
    if (!fs_1.default.existsSync(logsDir)) {
        fs_1.default.mkdirSync(logsDir); // Create logs directory if it doesn't exist
    }
};
// Generate the daily log file name
const getDailyLogFile = () => {
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    return path_1.default.join(logsDir, `logs-${today}.txt`);
};
// Clean up logs older than 30 days
const cleanOldLogs = () => {
    const now = Date.now();
    const cutoff = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
    // Read all files in the logs directory
    const files = fs_1.default.readdirSync(logsDir);
    files.forEach((file) => {
        const filePath = path_1.default.join(logsDir, file);
        const stats = fs_1.default.statSync(filePath);
        // Check if the file is older than 30 days
        if (now - stats.mtimeMs > cutoff) {
            fs_1.default.unlinkSync(filePath); // Delete the file
        }
    });
};
// Log a message
const log = (type, message) => {
    ensureLogsDir(); // Ensure logs directory exists
    cleanOldLogs(); // Clean old logs
    const logFile = getDailyLogFile(); // Get today's log file
    const timestamp = new Date().toISOString();
    const logLine = `${timestamp} - ${type}: ${message}\n`;
    fs_1.default.appendFileSync(logFile, logLine, 'utf8'); // Append the log line
    // Console log only in development environment
    if (process.env.NODE_ENV === 'development') {
        console.log(logLine.trim());
    }
};
exports.default = { log };
