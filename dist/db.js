"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Repository_1 = require("./models/Repository");
const Language_1 = require("./models/Language");
const TrendingMetric_1 = require("./models/TrendingMetric");
const AIContent_1 = require("./models/AIContent");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432'),
    username: process.env.DB_USER_NAME ?? 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true, // Automatically sync database schema during development
    logging: false, // Logs SQL queries for debugging
    entities: [Repository_1.Repository, Language_1.Language, TrendingMetric_1.TrendingMetric, AIContent_1.AIContent], // Add all entity models here
});
