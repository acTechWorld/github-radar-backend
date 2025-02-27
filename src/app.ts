import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { AppDataSource } from './db';
import repositoryRoutes from './routes/repositoryRoutes';
import languageRoutes from './routes/languageRoutes';
import githubRoutes from './routes/githubRoutes';
import aiReposComparaisonRoutes from './routes/AIReposComparaisonRoutes';
import aiRepoAnalysisRoutes from './routes/AIRepoAnalysisRoutes';
import logger from './utils/logger';
const app: Application = express();
app.use(cors());
app.use(bodyParser.json());

// Initialize TypeORM DataSource
AppDataSource.initialize()
  .then(() => {
    logger.log("INFO", 'Database connected successfully.');
  })
  .catch((error: any) => {
    logger.log("ERROR", `Error connecting to the database: ${error.message}`);
  });

// Add routes
app.use('/api/repositories', repositoryRoutes);
app.use('/api/languages', languageRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/aiReposComparaisons', aiReposComparaisonRoutes);
app.use('/api/aiRepoAnalysis', aiRepoAnalysisRoutes);

export default app;
