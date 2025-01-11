"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../db");
const resetDatabase = async () => {
    try {
        console.log('Initializing database connection...');
        await db_1.AppDataSource.initialize();
        console.log('Database connected.');
        console.log('Dropping all tables...');
        await db_1.AppDataSource.dropDatabase(); // Drops all tables in the database
        console.log('Tables dropped.');
        console.log('Recreating tables...');
        await db_1.AppDataSource.synchronize(); // Synchronizes the database, recreating the tables based on entities
        console.log('Tables recreated successfully.');
        console.log('Closing database connection...');
        await db_1.AppDataSource.destroy(); // Closes the database connection
        console.log('Database connection closed.');
        console.log('Project initialized successfully!');
    }
    catch (error) {
        console.error('Error during database reset:', error);
        process.exit(1);
    }
};
// Run the script
resetDatabase();
