"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../db");
const logger_1 = __importDefault(require("../utils/logger"));
const resetDatabase = async () => {
    try {
        logger_1.default.log("INFO", 'Initializing database connection...');
        await db_1.AppDataSource.initialize();
        logger_1.default.log("INFO", 'Database connected.');
        logger_1.default.log("INFO", 'Dropping all tables...');
        await db_1.AppDataSource.dropDatabase(); // Drops all tables in the database
        logger_1.default.log("INFO", 'Tables dropped.');
        logger_1.default.log("INFO", 'Recreating tables...');
        await db_1.AppDataSource.synchronize(); // Synchronizes the database, recreating the tables based on entities
        logger_1.default.log("INFO", 'Tables recreated successfully.');
        logger_1.default.log("INFO", 'Closing database connection...');
        await db_1.AppDataSource.destroy(); // Closes the database connection
        logger_1.default.log("INFO", 'Database connection closed.');
        logger_1.default.log("INFO", 'Project initialized successfully!');
    }
    catch (error) {
        logger_1.default.log("ERROR", `Error during database reset: ${error.message}`);
        process.exit(1);
    }
};
// Run the script
resetDatabase();
