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

    // Fetch repositories with at least two values in history fields
    const allRepositories = await this.repositoryRepo
      .createQueryBuilder("repository")
      .where(additionalWhereParams ?? {})
      .innerJoinAndSelect("repository.languages", "language", "language.name = :language", { language })
      .getMany();
    
    const filteredRepositories = allRepositories.filter(repo => {
      return (repo.stars_last_week && repo.stars_history.split(",")?.length > 1) || 
         (repo.forks_last_week && repo.forks_history.split(",")?.length > 1) || 
         (repo.watchers_last_week && repo.watchers_history.split(",")?.length > 1)
    })

    if (filteredRepositories.length === 0) {
      throw new Error(`No repositories with sufficient history found for language: ${language}`);
    }

    // Calculate the maximum value of each metric for scaling
    const maxStars = Math.max(...filteredRepositories.map((repo) => repo.stars_count));
    const maxForks = Math.max(...filteredRepositories.map((repo) => repo.forks_count));
    const maxWatchers = Math.max(...filteredRepositories.map((repo) => repo.watchers_count));


    const calculateWeightedTrendingScore = (repo: Repository) => {
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
    const repositoriesWithScores = filteredRepositories.map(repo => ({
      ...repo,
      weightedTrendingScore: calculateWeightedTrendingScore(repo),
    }));

    const calculateThresholds = (repositories: any, key: string) => {
      if (repositories.length === 0) {
        return 0; // Return a default threshold if no data is available
      }
      const sortedRepositories = [...repositories].sort((a, b) => b.weightedTrendingScore[key] - a.weightedTrendingScore[key]);
      const top5Percent = sortedRepositories.slice(0, Math.ceil(sortedRepositories.length * 0.05));
      return top5Percent.length > 0 ? top5Percent[top5Percent.length - 1].weightedTrendingScore[key] : 0;
    };
    
    const starsThreshold = calculateThresholds(repositoriesWithScores, 'stars');
    const forksThreshold = calculateThresholds(repositoriesWithScores, 'forks');
    const watchersThreshold = calculateThresholds(repositoriesWithScores, 'watchers');
    const combinedThreshold = calculateThresholds(repositoriesWithScores, 'combined');

    // Return the trendingMetrics
    const trendingMetrics: CalculatedTrendingMetrics = {
      stars_threshold: starsThreshold,
      forks_threshold: forksThreshold,
      watchers_threshold: watchersThreshold,
      combined_threshold: combinedThreshold,
      max_stars: maxStars,
      max_forks: maxForks,
      max_watchers: maxWatchers,
      type: 'global' // default value
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
