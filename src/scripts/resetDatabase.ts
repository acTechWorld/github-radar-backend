import { AppDataSource } from '../db';

const resetDatabase = async () => {
  try {
    console.log('Initializing database connection...');
    await AppDataSource.initialize();
    console.log('Database connected.');

    console.log('Dropping all tables...');
    await AppDataSource.dropDatabase(); // Drops all tables in the database
    console.log('Tables dropped.');

    console.log('Recreating tables...');
    await AppDataSource.synchronize(); // Synchronizes the database, recreating the tables based on entities
    console.log('Tables recreated successfully.');

    console.log('Closing database connection...');
    await AppDataSource.destroy(); // Closes the database connection
    console.log('Database connection closed.');

    console.log('Project initialized successfully!');
  } catch (error) {
    console.error('Error during database reset:', error);
    process.exit(1);
  }
};

// Run the script
resetDatabase();
