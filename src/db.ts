import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Repository } from './models/repository';
import { Language } from './models/language';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'root',
  database: 'project-m',
  synchronize: true, // Automatically sync database schema during development
  logging: false, // Logs SQL queries for debugging
  entities: [Repository, Language], // Add all entity models here
});