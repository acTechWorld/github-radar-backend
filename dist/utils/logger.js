"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const logsDir = path_1.default.join(__dirname, '../logs');
const logsFile = path_1.default.join(logsDir, 'logs.txt');
const ensureLogsFile = () => {
    if (!fs_1.default.existsSync(logsDir)) {
        fs_1.default.mkdirSync(logsDir); // Create logs directory if it doesn't exist
    }
    if (!fs_1.default.existsSync(logsFile)) {
        fs_1.default.writeFileSync(logsFile, ''); // Create logs.txt if it doesn't exist
    }
};
const log = (type, message) => {
    ensureLogsFile(); // Ensure file exists before appending
    const timestamp = new Date().toISOString();
    const logLine = `${timestamp} - ${type}:${message}\n`;
    fs_1.default.appendFileSync(logsFile, logLine, 'utf8');
};
exports.default = { log };
