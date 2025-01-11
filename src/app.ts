import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { AppDataSource } from './db';
import repositoryRoutes from './routes/repositoryRoutes';
import languageRoutes from './routes/languageRoutes';
import githubRoutes from './routes/githubRoutes';

const app: Application = express();
app.use(cors());
app.use(bodyParser.json());

// Initialize TypeORM DataSource
AppDataSource.initialize()
  .then(() => {
    console.log('Database connected successfully.');
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });

// Add routes
app.use('/api/repositories', repositoryRoutes);
app.use('/api/languages', languageRoutes);
app.use('/api/github', githubRoutes);

export default app;
