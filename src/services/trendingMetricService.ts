import { Repository } from "../models/Repository";  // Assuming Repository is your TypeORM entity
import { AppDataSource } from '../db';
import { TrendingMetric } from '../models/TrendingMetric';
import { Thresholds } from "../types/types";

export class TrendingMetricService {
  private repositoryRepo = AppDataSource.getRepository(Repository);
  private trendingMetricRepo = AppDataSource.getRepository(TrendingMetric);

  // Helper functions to calculate average and standard deviation
  private average(arr: number[]): number {
    return arr.reduce((sum, val) => sum + val, 0) / arr.length;
  }

  private stdDev(arr: number[]): number {
    const mean = this.average(arr);
    return Math.sqrt(arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / arr.length);
  }

  // Calculate the thresholds for stars, forks, and watchers with size-based weight
  async calculateTrendingThresholds(language: string): Promise<Thresholds> {
    // Fetch repositories with at least two values in history fields
    const repositories = await this.repositoryRepo
      .createQueryBuilder("repository")
      .innerJoinAndSelect("repository.languages", "language", "language.name = :language", { language })
      .where(
        `LENGTH(repository.stars_history) - LENGTH(REPLACE(repository.stars_history, ',', '')) >= 1 AND
         LENGTH(repository.forks_history) - LENGTH(REPLACE(repository.forks_history, ',', '')) >= 1 AND
         LENGTH(repository.watchers_history) - LENGTH(REPLACE(repository.watchers_history, ',', '')) >= 1`
      )
      .getMany();

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

    // Calculate total sum of metrics for normalization (total metrics)
    const totalStars = repositories.reduce((sum, repo) => sum + repo.stars_count, 0);
    const totalForks = repositories.reduce((sum, repo) => sum + repo.forks_count, 0);
    const totalWatchers = repositories.reduce((sum, repo) => sum + repo.watchers_count, 0);

    // Calculate the maximum value of each metric for scaling
    const maxStars = Math.max(...repositories.map((repo) => repo.stars_count));
    const maxForks = Math.max(...repositories.map((repo) => repo.forks_count));
    const maxWatchers = Math.max(...repositories.map((repo) => repo.watchers_count));

    // Calculate the scaling factor for each metric (this reflects the size of the metric)
    const scalingFactorStars = maxStars / totalStars;
    const scalingFactorForks = maxForks / totalForks;
    const scalingFactorWatchers = maxWatchers / totalWatchers;

    // Calculate thresholds for each metric (stars, forks, watchers) with weighted scaling
    const starsThreshold = this.average(starsChanges) + 2 * this.stdDev(starsChanges) * scalingFactorStars;
    const forksThreshold = this.average(forksChanges) + 2 * this.stdDev(forksChanges) * scalingFactorForks;
    const watchersThreshold = this.average(watchersChanges) + 2 * this.stdDev(watchersChanges) * scalingFactorWatchers;

    // Return the thresholds
    const thresholds: Thresholds = {
      stars_threshold: starsThreshold,
      forks_threshold: forksThreshold,
      watchers_threshold: watchersThreshold
    };

    return thresholds;
  }

  // Create or update trending metric for the language
  async createOrUpdateTrendingMetric(language: string, thresholds: Thresholds): Promise<void> {
    // Try to find if there's an existing entry for the language
    const existingMetric = await this.trendingMetricRepo.findOne({ where: { language } });

    if (existingMetric) {
      // If the metric already exists, update it
      existingMetric.min_star_growth = thresholds.stars_threshold;
      existingMetric.min_fork_growth = thresholds.forks_threshold;
      existingMetric.min_watcher_growth = thresholds.watchers_threshold;
      existingMetric.min_combined_growth = existingMetric.min_star_growth + existingMetric.min_fork_growth + existingMetric.min_watcher_growth
      // Save the updated metric
      await this.trendingMetricRepo.save(existingMetric);
      console.log(`Updated trending metric for language: ${language}`);
    } else {
      // If it doesn't exist, create a new entry
      const newTrendingMetric = new TrendingMetric();
      newTrendingMetric.language = language;
      newTrendingMetric.min_star_growth = thresholds.stars_threshold;
      newTrendingMetric.min_fork_growth = thresholds.forks_threshold;
      newTrendingMetric.min_watcher_growth = thresholds.watchers_threshold;
      newTrendingMetric.min_combined_growth = newTrendingMetric.min_star_growth + newTrendingMetric.min_fork_growth + newTrendingMetric.min_watcher_growth

      // Save the new metric
      await this.trendingMetricRepo.save(newTrendingMetric);
      console.log(`Created new trending metric for language: ${language}`);
    }
  }
}
