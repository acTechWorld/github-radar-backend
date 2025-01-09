// src/services/repository.service.ts
import { Repository } from '../models/Repository';
import { AppDataSource } from '../db';
import { Any, ArrayContains, Between, In, LessThanOrEqual, MoreThanOrEqual, ArrayOverlap, And, FindOperator } from 'typeorm';
import { RepositoryBody, RepositoryQuery } from '../types/types';
import { Language } from '../models/Language';
import { TrendingMetric } from '../models/TrendingMetric';

export class RepositoryService {
  private repositoryRepo = AppDataSource.getRepository(Repository);
  private languageRepo = AppDataSource.getRepository(Language);
  private trendingMetricRepo = AppDataSource.getRepository(TrendingMetric);

  async getAllRepositories(queries: RepositoryQuery) {
    const where: any = {};

    if (queries.stars) {
      const [min, max] = queries.stars.split('-').map(Number);
      if (!isNaN(min) && !isNaN(max)) {
        where.stars_count = where.stars_count = Between(min, max);
      } else if (!isNaN(min)) {
        where.stars_count = MoreThanOrEqual(min);
      } else if (!isNaN(max)) {
        where.stars_count = LessThanOrEqual(max);
      }
    }
    if (queries.forks) {
      const [min, max] = queries.forks.split('-').map(Number);
    
      if (!isNaN(min) && !isNaN(max)) {
        where.forks_count = Between(min, max);
      } else if (!isNaN(min)) {
        // If only min is valid, apply MoreThanOrEqual
        where.forks_count = MoreThanOrEqual(min);
      } else if (!isNaN(max)) {
        // If only max is valid, apply LessThanOrEqual
        where.forks_count = LessThanOrEqual(max);
      }
    }
    
    if (queries.open_issues_count) {
      const [min, max] = queries.open_issues_count.split('-').map(Number);
    
      if (!isNaN(min) && !isNaN(max)) {
        where.open_issues_count = Between(min, max);
      } else if (!isNaN(min)) {
        // If only min is valid, apply MoreThanOrEqual
        where.open_issues_count = MoreThanOrEqual(min);
      } else if (!isNaN(max)) {
        // If only max is valid, apply LessThanOrEqual
        where.open_issues_count = LessThanOrEqual(max);
      }
    }
    if (queries.created_after || queries.created_before) {
      const [min, max] = [
        queries.created_after ? new Date(queries.created_after) : undefined,
        queries.created_before ? new Date(queries.created_before) : undefined,
      ];
    
      if (min && max) {
        where.creation_date = Between(min, max);
      } else if (min) {
        where.creation_date = MoreThanOrEqual(min);
      } else if (max) {
        where.creation_date = LessThanOrEqual(max);
      }
    }
    
    if (queries.updated_after || queries.updated_before) {
      const [min, max] = [
        queries.updated_after ? new Date(queries.updated_after) : undefined,
        queries.updated_before ? new Date(queries.updated_before) : undefined,
      ];
    
      if (min && max) {
        where.last_updated = Between(min, max);
      } else if (min) {
        where.last_updated = MoreThanOrEqual(min);
      } else if (max) {
        where.last_updated = LessThanOrEqual(max);
      }
    }
    if (queries.topics && queries.topicsOperation) {
      const topicsArray = queries.topics.split(',').map((topic) => topic.trim()); // Trim to handle spaces
      if(queries.topicsOperation === 'OR') {
        where.topics = ArrayOverlap(topicsArray);
      } else {
        where.topics = ArrayContains(topicsArray);
      }
    }
    
    if (queries.licenses) {
      const licensesArray = queries.licenses.split(',').map((license) => license.trim()); // Trim to handle spaces
      where.license = Any(licensesArray);
    }
    if (queries.owner_type) {
      const ownerTypeArray = queries.owner_type.split(',').map((license) => license.trim()); // Trim to handle spaces
      where.owner_type = Any(ownerTypeArray);
    }
    if (queries.is_trending !== undefined) where.is_trending = queries.is_trending;
    if (queries.stars_last_week && !isNaN(parseInt(queries.stars_last_week))) {
      where.stars_last_week = MoreThanOrEqual(parseInt(queries.stars_last_week));
    }

    if (queries.languages) {
      const languageNames = queries.languages.split(',').map((name) => name.trim());
  
      // Fetch repositories with the languages relation loaded
      const partialResults = await this.repositoryRepo.find({
        where,
        relations: ['languages'], // Ensure languages are loaded
      });
  
      if (queries.languagesOperation === 'OR') {
        // OR logic: Find repositories where any of the languages match
        const results = partialResults.filter((repo) =>
          repo.languages.some((l) => languageNames.includes(l.name))
        );
        return results;
      } else {
        // AND logic: Find repositories where all the languages match
        const results = partialResults.filter((repo) =>
          languageNames.every((lang) => repo.languages.some((l) => l.name === lang))
        );
        return results;
      }
    }

    const repos =  await this.repositoryRepo.find({ where, relations: ['languages'] });
    return await Promise.all(repos.map(async repo => {
      const is_trending = await this.isTrending(repo)
      return {
        ...repo, 
        is_trending
      }
    }))
  }

  async getRepositoryById(id: number) {
    return await this.repositoryRepo.find({where: { id }, relations: ['languages']});
  }

  async getRepositoryByGithubId(githubId: number) {
    return await this.repositoryRepo.find({where: { github_id: githubId }, relations: ['languages']});
  }

// Create a new repository and associate languages
async createRepository(data: RepositoryBody) {
  const { languages = [], ...repositoryData } = data;

  // If no languages are provided, throw an error
  if (languages.length === 0) {
    throw new Error('At least one language must be provided.');
  }

  // Fetch the Language entities by name (if they exist)
  const existingLanguages = await this.languageRepo.findBy({
    name: In(languages),  // 'In' allows searching for multiple values at once
  });

  // Check if all the languages exist in the database
  const existingLanguageNames = existingLanguages.map((lang) => lang.name);
  const missingLanguages = languages.filter((language) => !existingLanguageNames.includes(language));

  if (missingLanguages.length > 0) {
    // If some languages are missing, return an error
    throw new Error(`The following languages do not exist: ${missingLanguages.join(', ')}`);
  }

  // Create a new repository entity with the provided data
  const newRepository = this.repositoryRepo.create({
    ...repositoryData,  // Destructure the rest of the repository fields
    stars_history: repositoryData.stars_count?.toString(),
    forks_history: repositoryData.forks_count?.toString(),
    watchers_history: repositoryData.watchers_count?.toString(),
    languages: existingLanguages,  // Associate the languages with the repository
  });

  // Save and return the new repository
  return await this.repositoryRepo.save(newRepository);
}

  async updateRepository(id: number, data: RepositoryBody) {
    const {languages, stars_count, forks_count, ...otherDatas} = data
    const repository = await this.repositoryRepo.findOne({where: { id }, relations: ['languages']});
    if (!repository) return null;
    let mergedDatas: any = otherDatas
    if(languages && languages.length > 0) {
      const existingLanguages = await this.languageRepo.findBy({
        name: In(languages),  // 'In' allows searching for multiple values at once
      });
    
      // Check if all the languages exist in the database
      const existingLanguageNames = existingLanguages.map((lang) => lang.name);
      const missingLanguages = languages.filter((language) => !existingLanguageNames.includes(language));
    
      if (missingLanguages.length > 0) {
        // If some languages are missing, return an error
        throw new Error(`The following languages do not exist: ${missingLanguages.join(', ')}`);
      }
      mergedDatas.languages = existingLanguages
    }
    if(stars_count) {
      const starsHistoryList = repository.stars_history?.split(',').slice(0,6)
      mergedDatas.stars_history = [
        stars_count.toString(),
        ...starsHistoryList,
      ].join(",")
    }

    if(forks_count) {
      const forksistoryList = repository.forks_history?.split(',').slice(0,6)
      mergedDatas.forks_history = [
        forks_count.toString(),
        ...forksistoryList,
      ].join(",")
    }
    const updatedRepository = this.repositoryRepo.merge(repository, mergedDatas);
    return await this.repositoryRepo.save(updatedRepository);
  }

  async deleteRepository(id: number) {
    const result = await this.repositoryRepo.delete(id);
    return result.affected !== 0;
  }

  async isTrending(repo: Repository): Promise<boolean> {
    const language = repo.languages[0]?.name 
    const trendingMetric = await this.trendingMetricRepo.findOne({ where: { language } });
    if (!trendingMetric) {
      return false;
    }
    const stars_last_week = repo.stars_last_week ?? 0
    const forks_last_week = repo.forks_last_week ?? 0
    const watchers_last_week = repo.watchers_last_week ?? 0
    return (
      stars_last_week >= trendingMetric.min_star_growth ||
      forks_last_week >= trendingMetric.min_fork_growth ||
      watchers_last_week >= trendingMetric.min_watcher_growth ||
      stars_last_week + forks_last_week + watchers_last_week >= trendingMetric.min_combined_growth
    );
  }
}
