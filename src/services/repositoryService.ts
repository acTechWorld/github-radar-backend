// src/services/repository.service.ts
import { Repository } from '../models/Repository';
import { AppDataSource } from '../db';
import { Any, ArrayContains, Between, In, LessThanOrEqual, MoreThanOrEqual, ArrayOverlap, IsNull, Not } from 'typeorm';
import { RepositoryBody, RepositoryQuery, RepositoryUpdateBody, TypeTrendingMetrics } from '../types/types';
import { Language } from '../models/Language';
import { TrendingMetric } from '../models/TrendingMetric';

export class RepositoryService {
  private repositoryRepo = AppDataSource.getRepository(Repository);
  private languageRepo = AppDataSource.getRepository(Language);
  private trendingMetricRepo = AppDataSource.getRepository(TrendingMetric);

  async getAllRepositories(queries: RepositoryQuery) {
    const where: any = {};
    const page = parseInt(queries.page) || 1;
    const limit = parseInt(queries.limit) || 20;
    const skip = (page - 1) * limit;

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

    if (queries.watchers) {
      const [min, max] = queries.watchers.split('-').map(Number);
    
      if (!isNaN(min) && !isNaN(max)) {
        where.watchers_count = Between(min, max);
      } else if (!isNaN(min)) {
        // If only min is valid, apply MoreThanOrEqual
        where.watchers_count = MoreThanOrEqual(min);
      } else if (!isNaN(max)) {
        // If only max is valid, apply LessThanOrEqual
        where.watchers_count = LessThanOrEqual(max);
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

    if (queries.technical_created_at_after || queries.technical_created_at_before) {
      const [min, max] = [
        queries.technical_created_at_after ? new Date(queries.technical_created_at_after) : undefined,
        queries.technical_created_at_before ? new Date(queries.technical_created_at_before) : undefined,
      ];
    
      if (min && max) {
        where.created_at = Between(min, max);
      } else if (min) {
        where.created_at = MoreThanOrEqual(min);
      } else if (max) {
        where.created_at = LessThanOrEqual(max);
      }
    }
    
    if (queries.technical_updated_at_after || queries.technical_updated_at_before) {
      const [min, max] = [
        queries.technical_updated_at_after ? new Date(queries.technical_updated_at_after) : undefined,
        queries.technical_updated_at_before ? new Date(queries.technical_updated_at_before) : undefined,
      ];
    
      if (min && max) {
        where.updated_at = Between(min, max);
      } else if (min) {
        where.updated_at = MoreThanOrEqual(min);
      } else if (max) {
        where.updated_at = LessThanOrEqual(max);
      }
    }

    if(queries.hasReadMe !== undefined){
      if(queries.hasReadMe === 'true') {
        where.readme_content = Not(IsNull())
      } else if(queries.hasReadMe === 'false') {
        where.readme_content = IsNull()
      }
    }
    
    
    if (queries.licenses) {
      const licensesArray = queries.licenses.split(',').map((license) => license.trim()); // Trim to handle spaces
      where.license = Any(licensesArray);
    }
    if (queries.owner_types) {
      const ownerTypeArray = queries.owner_types.split(',').map((license) => license.trim()); // Trim to handle spaces
      where.owner_type = Any(ownerTypeArray);
    }
    if (queries.stars_last_week && !isNaN(parseInt(queries.stars_last_week))) {
      where.stars_last_week = MoreThanOrEqual(parseInt(queries.stars_last_week));
    }

    const queryBuilder = this.repositoryRepo.createQueryBuilder('repo')
    .leftJoinAndSelect('repo.languages', 'language') // Join the languages relation
    .leftJoinAndSelect('repo.trending_metrics', 'trending_metric') // Join the languages relation
    .where(where);
  
    if (queries.languages) {
      const languageNames = queries.languages.split(',').map((name) => name.trim());
    
      if (queries.languagesOperation === 'OR') {
        // If 'OR', use IN to check if any language matches
        queryBuilder.andWhere('language.name IN (:...languageNames)', { languageNames });
      } else if (queries.languagesOperation === 'AND') {
        // If 'AND', ensure that all languages are matched
        languageNames.forEach((language, index) => {
          queryBuilder.andWhere(
            `EXISTS (
              SELECT 1 FROM repository_languages rl
              INNER JOIN languages l ON l.id = rl.language_id
              WHERE rl.repository_id = repo.id
              AND l.name = :language${index}
            )`,
            { [`language${index}`]: language }
          );
        });
      }
    }

    if (queries.search) {
      const searchTerm = `%${queries.search}%`; // Add wildcards for LIKE search
      const exactTerm = queries.search; // Exact match
      queryBuilder.andWhere(
        '(repo.name = :exactName OR repo.name LIKE :wildcardName OR repo.description = :exactDesc OR repo.description LIKE :wildcardDesc)',
        {
          exactName: exactTerm,
          wildcardName: searchTerm,
          exactDesc: exactTerm,
          wildcardDesc: searchTerm,
        }
      );
    }

    if(queries.trendingTypes) {
      const listTrendingTypes = queries.trendingTypes.split(',')
      if (queries.trendingTypesOperation === 'OR') {
        // If 'OR', use IN to check if any language matches
        queryBuilder.andWhere('trending_metric.type IN (:...listTrendingTypes)', { listTrendingTypes });
      } else if (queries.trendingTypesOperation === 'AND') {
        // If 'AND', ensure that all languages are matched
        listTrendingTypes.forEach((trendingType, index) => {
          queryBuilder.andWhere(
            `EXISTS (
              SELECT 1 FROM repository_trending_metrics rt
              INNER JOIN trending_metrics tm ON tm.id = rt.trending_metric_id
              WHERE rt.repository_id = repo.id
              AND tm.type = :trendingType${index}
            )`,
            { [`trendingType${index}`]: trendingType }
          );
        });
      }
    }
  
    // Apply pagination
    const [items, totalCount] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();
    
    return {
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      limit,
      items,
    };

  }
  async getRepositoryById(id: number) {
    return await this.repositoryRepo.findOne({where: { id }, relations: ['languages']});
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

  async updateRepository(id: number, data: RepositoryUpdateBody) {
    const {languages, trendingMetrics, stars_count, forks_count, watchers_count, ...otherDatas} = data
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

    if(trendingMetrics && trendingMetrics.length > 0) {
      const existingTrendingMetrics = await this.trendingMetricRepo.findBy({
        language: In(trendingMetrics.map(t => t.language)),  // 'In' allows searching for multiple values at once
        type: In(trendingMetrics.map(t => t.type)),  // 'In' allows searching for multiple values at once
      });
    
      const missingTrendingMetrics = trendingMetrics.filter((t) => !existingTrendingMetrics.find(existing => t.language === existing.language && t.type === existing.type));
    
      if (missingTrendingMetrics.length > 0) {
        // If some trending metrics are missing, return an error
        throw new Error(`The following trending metrics do not exist: ${missingTrendingMetrics.join(', ')}`);
      }
      mergedDatas.trending_metrics = existingTrendingMetrics
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

    if(watchers_count) {
      const watchersistoryList = repository.watchers_history?.split(',').slice(0,6)
      mergedDatas.watchers_history = [
        watchers_count.toString(),
        ...watchersistoryList,
      ].join(",")
    }

    mergedDatas.updated_at = new Date();

    const updatedRepository = this.repositoryRepo.merge(repository, mergedDatas);
    return await this.repositoryRepo.save(updatedRepository);
  }

  async deleteRepository(id: number) {
    const result = await this.repositoryRepo.delete(id);
    return result.affected !== 0;
  }

  async updateIsTrendingReposFromTrendingLanguageType(language: string, typeTrendingMetrics: TypeTrendingMetrics, additionalWhereParams?: any) {
    const allRepositories = await this.repositoryRepo
      .createQueryBuilder("repository")
      .where(additionalWhereParams ?? {})
      .innerJoinAndSelect("repository.languages", "language", "language.name = :language", { language })
      .leftJoinAndSelect('repository.trending_metrics', 'trending_metrics')
      .getMany();
    const trendingMetric = await this.trendingMetricRepo.findOne({ where :{ language, type: typeTrendingMetrics}});
    if(trendingMetric) {
      allRepositories.forEach(repo => {
        const isTrending = this.isTrending(trendingMetric, repo, language )
        if(isTrending) {
          this.updateRepository(repo.id, {trendingMetrics: [...(repo.trending_metrics?? []), {language: trendingMetric.language, type: trendingMetric.type}]})
        }
      })
    }
  }

  private isTrending(trendingMetric: TrendingMetric, repo: Repository, language: string): boolean {
    // Maximum values for normalization
    const maxStars = trendingMetric.max_stars ?? 1; 
    const maxForks = trendingMetric.max_forks ?? 1;
    const maxWatchers = trendingMetric.max_watchers ?? 1;
  
    // Use your log-based trending score calculation for stars, forks, and watchers
    const starBoost = (repo.stars_last_week ?? 0) * Math.log(1 + (maxStars / (repo.stars_count || 1)));
    const forkBoost = (repo.forks_last_week ?? 0) * Math.log(1 + (maxForks / (repo.forks_count || 1)));
    const watcherBoost = (repo.watchers_last_week ?? 0) * Math.log(1 + (maxWatchers / (repo.watchers_count || 1)));
  
    // Combined trending score
    const combinedScore = starBoost + forkBoost + watcherBoost;
  
    // Check if the repository exceeds the defined thresholds
    const isTrendingByStars = starBoost >= (trendingMetric.stars_threshold ?? 0);
    const isTrendingByForks = forkBoost >= (trendingMetric.forks_threshold ?? 0);
    const isTrendingByWatchers = watcherBoost >= (trendingMetric.watchers_threshold ?? 0);
    const isTrendingByCombinedScore = combinedScore >= (trendingMetric.combined_threshold ?? 0);
  
    // Return true if any threshold is met
    return isTrendingByStars || isTrendingByForks || isTrendingByWatchers || isTrendingByCombinedScore;
  }
  
  
}
