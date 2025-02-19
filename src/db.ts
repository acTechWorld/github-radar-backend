import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Repository } from './models/Repository';
import { Language } from './models/Language';
import { TrendingMetric } from './models/TrendingMetric';
import { AIContent } from './models/AIContent';
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432'),
  username: process.env.DB_USER_NAME ?? 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true, // Automatically sync database schema during development
  logging: false, // Logs SQL queries for debugging
  entities: [Repository, Language, TrendingMetric, AIContent], // Add all entity models here
});