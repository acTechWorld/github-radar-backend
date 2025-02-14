import { Repository } from "../models/Repository";  // Assuming Repository is your TypeORM entity
import { AppDataSource } from '../db';
import { TrendingMetric } from '../models/TrendingMetric';
import { CalculatedTrendingMetrics, TypeTrendingMetrics } from "../types/types";
import { MoreThanOrEqual } from "typeorm";

export class TrendingMetricService {
  private repositoryRepo = AppDataSource.getRepository(Repository);
  private trendingMetricRepo = AppDataSource.getRepository(TrendingMetric);


  // Calculate the thresholds for stars, forks, and watchers with size-based weight
  async calculateTrendingMetrics(language: string, additionalWhereParams?: any): Promise<CalculatedTrendingMetrics> {
    const allRepositories = await this.repositoryRepo
      .createQueryBuilder("repository")
      .where(additionalWhereParams ?? {})
      .innerJoinAndSelect("repository.languages", "language", "language.name = :language", { language })
      .getMany();

    const filteredRepositories = allRepositories.filter(repo => {
      return (repo.stars_last_week && repo.stars_history.split(",")?.length > 1) || 
         (repo.forks_last_week && repo.forks_history.split(",")?.length > 1) || 
         (repo.watchers_last_week && repo.watchers_history.split(",")?.length > 1);
    });

    if (filteredRepositories.length === 0) {
      throw new Error(`No repositories with sufficient history found for language: ${language}`);
    }

    const maxStars = Math.max(...filteredRepositories.map(repo => repo.stars_count));
    const maxForks = Math.max(...filteredRepositories.map(repo => repo.forks_count));
    const maxWatchers = Math.max(...filteredRepositories.map(repo => repo.watchers_count));

    const calculateTrendingScore = (repo: Repository) => {
      const starBoost = repo.stars_last_week * Math.log(1 + (maxStars / (repo.stars_count || 1)));
      const forkBoost = repo.forks_last_week * Math.log(1 + (maxForks / (repo.forks_count || 1)));
      const watcherBoost = repo.watchers_last_week * Math.log(1 + (maxWatchers / (repo.watchers_count || 1)));

      return {
        stars: starBoost,
        forks: forkBoost,
        watchers: watcherBoost,
        combined: starBoost + forkBoost + watcherBoost
      };
    };

    const repositoriesWithScores = filteredRepositories.map(repo => ({
      ...repo,
      trendingScore: calculateTrendingScore(repo)
    }));

    const calculateThresholds = (repositories: any, key: string) => {
      const sortedRepositories = [...repositories].sort((a, b) => b.trendingScore[key] - a.trendingScore[key]);
      const top10Percent = sortedRepositories.slice(0, Math.ceil(sortedRepositories.length * 0.10));
      return top10Percent.length > 0 ? top10Percent[top10Percent.length - 1].trendingScore[key] : 0;
    };

    const trendingMetrics: CalculatedTrendingMetrics = {
      stars_threshold: calculateThresholds(repositoriesWithScores, 'stars'),
      forks_threshold: calculateThresholds(repositoriesWithScores, 'forks'),
      watchers_threshold: calculateThresholds(repositoriesWithScores, 'watchers'),
      combined_threshold: calculateThresholds(repositoriesWithScores, 'combined'),
      max_stars: maxStars,
      max_forks: maxForks,
      max_watchers: maxWatchers,
      type: 'global'
    };

    return trendingMetrics;
  }


  async clearTrendingMetricRepos(params: any): Promise<void> {
      const allMetrics = await this.trendingMetricRepo.find({where: params})
      allMetrics.forEach(async metric => {
        metric.repositories = []
        await this.trendingMetricRepo.save(metric)
      })
  }

  // Create or update trending metric for the language
  async createOrUpdateTrendingMetric(language: string, calculatedTrendingMetrics: CalculatedTrendingMetrics): Promise<void> {
    // Try to find if there's an existing entry for the language
    const existingMetric = await this.trendingMetricRepo.findOne({ where: { language, type: calculatedTrendingMetrics.type } });
    if (existingMetric) {
      // If the metric already exists, update it
      existingMetric.stars_threshold = calculatedTrendingMetrics.stars_threshold;
      existingMetric.forks_threshold = calculatedTrendingMetrics.forks_threshold;
      existingMetric.watchers_threshold = calculatedTrendingMetrics.watchers_threshold;
      existingMetric.combined_threshold = calculatedTrendingMetrics.combined_threshold;
      existingMetric.max_stars = calculatedTrendingMetrics.max_stars;
      existingMetric.max_forks = calculatedTrendingMetrics.max_forks;
      existingMetric.max_watchers = calculatedTrendingMetrics.max_watchers;
      existingMetric.type = calculatedTrendingMetrics.type
      // Save the updated metric
      await this.trendingMetricRepo.save(existingMetric);
    } else {
      // If it doesn't exist, create a new entry
      const newTrendingMetric = new TrendingMetric();
      newTrendingMetric.language = language;
      newTrendingMetric.stars_threshold = calculatedTrendingMetrics.stars_threshold;
      newTrendingMetric.forks_threshold = calculatedTrendingMetrics.forks_threshold;
      newTrendingMetric.watchers_threshold = calculatedTrendingMetrics.watchers_threshold;
      newTrendingMetric.combined_threshold = calculatedTrendingMetrics.combined_threshold;
      newTrendingMetric.max_stars = calculatedTrendingMetrics.max_stars;
      newTrendingMetric.max_forks = calculatedTrendingMetrics.max_forks;
      newTrendingMetric.max_watchers = calculatedTrendingMetrics.max_watchers;
      newTrendingMetric.type = calculatedTrendingMetrics.type
      // Save the new metric
      await this.trendingMetricRepo.save(newTrendingMetric);
    }
  }

  generateFiltersRepoFromTrendingMetricType(type: TypeTrendingMetrics){
    const result: any = {}
    if(type === 'last_6_months') {
      var d = new Date();
      d.setMonth(d.getMonth() - 6);
      result.creation_date = MoreThanOrEqual(d)
    }
    return result;
  }
}
