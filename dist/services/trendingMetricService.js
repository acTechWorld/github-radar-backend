"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrendingMetricService = void 0;
const Repository_1 = require("@/models/Repository"); // Assuming Repository is your TypeORM entity
const db_1 = require("../db");
const TrendingMetric_1 = require("@/models/TrendingMetric");
class TrendingMetricService {
    repositoryRepo = db_1.AppDataSource.getRepository(Repository_1.Repository);
    trendingMetricRepo = db_1.AppDataSource.getRepository(TrendingMetric_1.TrendingMetric);
    // Calculate the thresholds for stars, forks, and watchers with size-based weight
    async calculateTrendingMetrics(language) {
        // Fetch repositories with at least two values in history fields
        let repositories = await this.repositoryRepo
            .createQueryBuilder("repository")
            .innerJoinAndSelect("repository.languages", "language", "language.name = :language", { language })
            .getMany();
        repositories = repositories.filter(repo => {
            return (repo.stars_last_week && repo.stars_history.split(",")?.length > 1) ||
                (repo.forks_last_week && repo.forks_history.split(",")?.length > 1) ||
                (repo.watchers_last_week && repo.watchers_history.split(",")?.length > 1);
        });
        if (repositories.length === 0) {
            throw new Error(`No repositories with sufficient history found for language: ${language}`);
        }
        // Extract last week's changes for each metric
        const starsChanges = repositories
            .map((repo) => repo.stars_last_week)
            .filter((stars_last_week) => stars_last_week !== null && stars_last_week !== undefined);
        const forksChanges = repositories
            .map((repo) => repo.forks_last_week)
            .filter((forks_last_week) => forks_last_week !== null && forks_last_week !== undefined);
        const watchersChanges = repositories
            .map((repo) => repo.watchers_last_week)
            .filter((watchers_last_week) => watchers_last_week !== null && watchers_last_week !== undefined);
        // Calculate the maximum value of each metric for scaling
        const maxStars = Math.max(...repositories.map((repo) => repo.stars_count));
        const maxForks = Math.max(...repositories.map((repo) => repo.forks_count));
        const maxWatchers = Math.max(...repositories.map((repo) => repo.watchers_count));
        const calculateWeightedTrendingScore = (repo) => {
            const sizeWeightStars = (repo.stars_count / maxStars) || 0;
            const sizeWeightForks = (repo.forks_count / maxForks) || 0;
            const sizeWeightWatchers = (repo.watchers_count / maxWatchers) || 0;
            const starsScore = repo.stars_last_week / (1 + sizeWeightStars);
            const forksScore = repo.forks_last_week / (1 + sizeWeightForks);
            const watchersScore = repo.watchers_last_week / (1 + sizeWeightWatchers);
            return {
                stars: starsScore,
                forks: forksScore,
                watchers: watchersScore,
                combined: starsScore + forksScore + watchersScore
            };
        };
        // Calculate scores for each repository
        const repositoriesWithScores = repositories.map(repo => ({
            ...repo,
            weightedTrendingScore: calculateWeightedTrendingScore(repo),
        }));
        const calculateThresholds = (repositories, key) => {
            if (repositories.length === 0) {
                return 0; // Return a default threshold if no data is available
            }
            const sortedRepositories = [...repositories].sort((a, b) => b.weightedTrendingScore[key] - a.weightedTrendingScore[key]);
            const top10Percent = sortedRepositories.slice(0, Math.ceil(sortedRepositories.length * 0.1));
            return top10Percent.length > 0 ? top10Percent[top10Percent.length - 1].weightedTrendingScore[key] : 0;
        };
        const starsThreshold = calculateThresholds(repositoriesWithScores, 'stars');
        const forksThreshold = calculateThresholds(repositoriesWithScores, 'forks');
        const watchersThreshold = calculateThresholds(repositoriesWithScores, 'watchers');
        const combinedThreshold = calculateThresholds(repositoriesWithScores, 'combined');
        // Return the trendingMetrics
        const trendingMetrics = {
            stars_threshold: starsThreshold,
            forks_threshold: forksThreshold,
            watchers_threshold: watchersThreshold,
            combined_threshold: combinedThreshold,
            max_stars: maxStars,
            max_forks: maxForks,
            max_watchers: maxWatchers
        };
        return trendingMetrics;
    }
    // Create or update trending metric for the language
    async createOrUpdateTrendingMetric(language, calculatedTrendingMetrics) {
        // Try to find if there's an existing entry for the language
        const existingMetric = await this.trendingMetricRepo.findOne({ where: { language } });
        if (existingMetric) {
            // If the metric already exists, update it
            existingMetric.stars_threshold = calculatedTrendingMetrics.stars_threshold;
            existingMetric.forks_threshold = calculatedTrendingMetrics.forks_threshold;
            existingMetric.watchers_threshold = calculatedTrendingMetrics.watchers_threshold;
            existingMetric.combined_threshold = calculatedTrendingMetrics.combined_threshold;
            existingMetric.max_stars = calculatedTrendingMetrics.max_stars;
            existingMetric.max_forks = calculatedTrendingMetrics.max_forks;
            existingMetric.max_watchers = calculatedTrendingMetrics.max_watchers;
            // Save the updated metric
            await this.trendingMetricRepo.save(existingMetric);
            console.log(`Updated trending metric for language: ${language}`);
        }
        else {
            // If it doesn't exist, create a new entry
            const newTrendingMetric = new TrendingMetric_1.TrendingMetric();
            newTrendingMetric.language = language;
            newTrendingMetric.stars_threshold = calculatedTrendingMetrics.stars_threshold;
            newTrendingMetric.forks_threshold = calculatedTrendingMetrics.forks_threshold;
            newTrendingMetric.watchers_threshold = calculatedTrendingMetrics.watchers_threshold;
            newTrendingMetric.combined_threshold = calculatedTrendingMetrics.combined_threshold;
            newTrendingMetric.max_stars = calculatedTrendingMetrics.max_stars;
            newTrendingMetric.max_forks = calculatedTrendingMetrics.max_forks;
            newTrendingMetric.max_watchers = calculatedTrendingMetrics.max_watchers;
            // Save the new metric
            await this.trendingMetricRepo.save(newTrendingMetric);
            console.log(`Created new trending metric for language: ${language}`);
        }
    }
}
exports.TrendingMetricService = TrendingMetricService;
