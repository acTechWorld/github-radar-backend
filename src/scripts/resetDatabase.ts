import { AppDataSource } from '../db';
import logger from '../utils/logger';
const resetDatabase = async () => {
  try {
    logger.log("INFO", 'Initializing database connection...');
    await AppDataSource.initialize();
    logger.log("INFO", 'Database connected.');

    logger.log("INFO", 'Dropping all tables...');
    await AppDataSource.dropDatabase(); // Drops all tables in the database
    logger.log("INFO", 'Tables dropped.');

    logger.log("INFO", 'Recreating tables...');
    await AppDataSource.synchronize(); // Synchronizes the database, recreating the tables based on entities
    logger.log("INFO", 'Tables recreated successfully.');

    logger.log("INFO", 'Closing database connection...');
    await AppDataSource.destroy(); // Closes the database connection
    logger.log("INFO", 'Database connection closed.');

    logger.log("INFO", 'Project initialized successfully!');
  } catch (error: any) {
    logger.log("ERROR", `Error during database reset: ${error.message}`);
    process.exit(1);
  }
};

// Run the script
resetDatabase();
