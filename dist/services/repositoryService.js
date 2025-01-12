"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoryService = void 0;
// src/services/repository.service.ts
const Repository_1 = require("../models/Repository");
const db_1 = require("../db");
const typeorm_1 = require("typeorm");
const Language_1 = require("../models/Language");
const TrendingMetric_1 = require("../models/TrendingMetric");
class RepositoryService {
    repositoryRepo = db_1.AppDataSource.getRepository(Repository_1.Repository);
    languageRepo = db_1.AppDataSource.getRepository(Language_1.Language);
    trendingMetricRepo = db_1.AppDataSource.getRepository(TrendingMetric_1.TrendingMetric);
    async getAllRepositories(queries) {
        const where = {};
        const page = parseInt(queries.page) || 1;
        const limit = parseInt(queries.limit) || 20;
        const skip = (page - 1) * limit;
        // **Search filter for name and description fields**:
        if (queries.search) {
            const searchTerm = `%${queries.search}%`; // Add wildcards for LIKE search
            where.name = (0, typeorm_1.Like)(searchTerm); // Search in the `name` field
            where.description = (0, typeorm_1.Like)(searchTerm); // Search in the `description` field
        }
        if (queries.stars) {
            const [min, max] = queries.stars.split('-').map(Number);
            if (!isNaN(min) && !isNaN(max)) {
                where.stars_count = where.stars_count = (0, typeorm_1.Between)(min, max);
            }
            else if (!isNaN(min)) {
                where.stars_count = (0, typeorm_1.MoreThanOrEqual)(min);
            }
            else if (!isNaN(max)) {
                where.stars_count = (0, typeorm_1.LessThanOrEqual)(max);
            }
        }
        if (queries.forks) {
            const [min, max] = queries.forks.split('-').map(Number);
            if (!isNaN(min) && !isNaN(max)) {
                where.forks_count = (0, typeorm_1.Between)(min, max);
            }
            else if (!isNaN(min)) {
                // If only min is valid, apply MoreThanOrEqual
                where.forks_count = (0, typeorm_1.MoreThanOrEqual)(min);
            }
            else if (!isNaN(max)) {
                // If only max is valid, apply LessThanOrEqual
                where.forks_count = (0, typeorm_1.LessThanOrEqual)(max);
            }
        }
        if (queries.watchers) {
            const [min, max] = queries.watchers.split('-').map(Number);
            if (!isNaN(min) && !isNaN(max)) {
                where.watchers_count = (0, typeorm_1.Between)(min, max);
            }
            else if (!isNaN(min)) {
                // If only min is valid, apply MoreThanOrEqual
                where.watchers_count = (0, typeorm_1.MoreThanOrEqual)(min);
            }
            else if (!isNaN(max)) {
                // If only max is valid, apply LessThanOrEqual
                where.watchers_count = (0, typeorm_1.LessThanOrEqual)(max);
            }
        }
        if (queries.open_issues_count) {
            const [min, max] = queries.open_issues_count.split('-').map(Number);
            if (!isNaN(min) && !isNaN(max)) {
                where.open_issues_count = (0, typeorm_1.Between)(min, max);
            }
            else if (!isNaN(min)) {
                // If only min is valid, apply MoreThanOrEqual
                where.open_issues_count = (0, typeorm_1.MoreThanOrEqual)(min);
            }
            else if (!isNaN(max)) {
                // If only max is valid, apply LessThanOrEqual
                where.open_issues_count = (0, typeorm_1.LessThanOrEqual)(max);
            }
        }
        if (queries.created_after || queries.created_before) {
            const [min, max] = [
                queries.created_after ? new Date(queries.created_after) : undefined,
                queries.created_before ? new Date(queries.created_before) : undefined,
            ];
            if (min && max) {
                where.creation_date = (0, typeorm_1.Between)(min, max);
            }
            else if (min) {
                where.creation_date = (0, typeorm_1.MoreThanOrEqual)(min);
            }
            else if (max) {
                where.creation_date = (0, typeorm_1.LessThanOrEqual)(max);
            }
        }
        if (queries.updated_after || queries.updated_before) {
            const [min, max] = [
                queries.updated_after ? new Date(queries.updated_after) : undefined,
                queries.updated_before ? new Date(queries.updated_before) : undefined,
            ];
            if (min && max) {
                where.last_updated = (0, typeorm_1.Between)(min, max);
            }
            else if (min) {
                where.last_updated = (0, typeorm_1.MoreThanOrEqual)(min);
            }
            else if (max) {
                where.last_updated = (0, typeorm_1.LessThanOrEqual)(max);
            }
        }
        if (queries.topics && queries.topicsOperation) {
            const topicsArray = queries.topics.split(',').map((topic) => topic.trim()); // Trim to handle spaces
            if (queries.topicsOperation === 'OR') {
                where.topics = (0, typeorm_1.ArrayOverlap)(topicsArray);
            }
            else {
                where.topics = (0, typeorm_1.ArrayContains)(topicsArray);
            }
        }
        if (queries.licenses) {
            const licensesArray = queries.licenses.split(',').map((license) => license.trim()); // Trim to handle spaces
            where.license = (0, typeorm_1.Any)(licensesArray);
        }
        if (queries.owner_types) {
            const ownerTypeArray = queries.owner_types.split(',').map((license) => license.trim()); // Trim to handle spaces
            where.owner_type = (0, typeorm_1.Any)(ownerTypeArray);
        }
        if (queries.stars_last_week && !isNaN(parseInt(queries.stars_last_week))) {
            where.stars_last_week = (0, typeorm_1.MoreThanOrEqual)(parseInt(queries.stars_last_week));
        }
        if (queries.is_trending !== undefined)
            where.is_trending = queries.is_trending;
        const queryBuilder = this.repositoryRepo.createQueryBuilder('repo')
            .leftJoinAndSelect('repo.languages', 'language') // Join the languages relation
            .where(where);
        if (queries.languages) {
            const languageNames = queries.languages.split(',').map((name) => name.trim());
            if (queries.languagesOperation === 'OR') {
                // If 'OR', use IN to check if any language matches
                queryBuilder.andWhere('language.name IN (:...languageNames)', { languageNames });
            }
            else if (queries.languagesOperation === 'AND') {
                // If 'AND', ensure that all languages are matched
                languageNames.forEach((language, index) => {
                    queryBuilder.andWhere(`EXISTS (
              SELECT 1 FROM repository_languages rl
              INNER JOIN languages l ON l.id = rl.language_id
              WHERE rl.repository_id = repo.id
              AND l.name = :language${index}
            )`, { [`language${index}`]: language });
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
    async getRepositoryById(id) {
        return await this.repositoryRepo.findOne({ where: { id }, relations: ['languages'] });
    }
    async getRepositoryByGithubId(githubId) {
        return await this.repositoryRepo.find({ where: { github_id: githubId }, relations: ['languages'] });
    }
    // Create a new repository and associate languages
    async createRepository(data) {
        const { languages = [], ...repositoryData } = data;
        // If no languages are provided, throw an error
        if (languages.length === 0) {
            throw new Error('At least one language must be provided.');
        }
        // Fetch the Language entities by name (if they exist)
        const existingLanguages = await this.languageRepo.findBy({
            name: (0, typeorm_1.In)(languages), // 'In' allows searching for multiple values at once
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
            ...repositoryData, // Destructure the rest of the repository fields
            stars_history: repositoryData.stars_count?.toString(),
            forks_history: repositoryData.forks_count?.toString(),
            watchers_history: repositoryData.watchers_count?.toString(),
            languages: existingLanguages, // Associate the languages with the repository
        });
        // Save and return the new repository
        return await this.repositoryRepo.save(newRepository);
    }
    async updateRepository(id, data) {
        const { languages, stars_count, forks_count, watchers_count, ...otherDatas } = data;
        const repository = await this.repositoryRepo.findOne({ where: { id }, relations: ['languages'] });
        if (!repository)
            return null;
        let mergedDatas = otherDatas;
        if (languages && languages.length > 0) {
            const existingLanguages = await this.languageRepo.findBy({
                name: (0, typeorm_1.In)(languages), // 'In' allows searching for multiple values at once
            });
            // Check if all the languages exist in the database
            const existingLanguageNames = existingLanguages.map((lang) => lang.name);
            const missingLanguages = languages.filter((language) => !existingLanguageNames.includes(language));
            if (missingLanguages.length > 0) {
                // If some languages are missing, return an error
                throw new Error(`The following languages do not exist: ${missingLanguages.join(', ')}`);
            }
            mergedDatas.languages = existingLanguages;
        }
        if (stars_count) {
            const starsHistoryList = repository.stars_history?.split(',').slice(0, 6);
            mergedDatas.stars_history = [
                stars_count.toString(),
                ...starsHistoryList,
            ].join(",");
        }
        if (forks_count) {
            const forksistoryList = repository.forks_history?.split(',').slice(0, 6);
            mergedDatas.forks_history = [
                forks_count.toString(),
                ...forksistoryList,
            ].join(",");
        }
        if (watchers_count) {
            const watchersistoryList = repository.watchers_history?.split(',').slice(0, 6);
            mergedDatas.watchers_history = [
                watchers_count.toString(),
                ...watchersistoryList,
            ].join(",");
        }
        const updatedRepository = this.repositoryRepo.merge(repository, mergedDatas);
        return await this.repositoryRepo.save(updatedRepository);
    }
    async deleteRepository(id) {
        const result = await this.repositoryRepo.delete(id);
        return result.affected !== 0;
    }
    async updateIsTrendingReposFromLanguage(language) {
        const allRepositories = await this.repositoryRepo
            .createQueryBuilder("repository")
            .innerJoinAndSelect("repository.languages", "language", "language.name = :language", { language })
            .getMany();
        const trendingMetric = await this.trendingMetricRepo.findOneBy({ language });
        if (trendingMetric) {
            allRepositories.forEach(repo => {
                const isTrending = this.isTrending(trendingMetric, repo, language);
            });
        }
    }
    isTrending(trendingMetric, repo, language) {
        // Maximum values for size normalization (you may fetch these from your trending metric or calculate dynamically)
        const maxStars = trendingMetric.max_stars ?? 1; // Avoid division by 0
        const maxForks = trendingMetric.max_forks ?? 1;
        const maxWatchers = trendingMetric.max_watchers ?? 1;
        // Calculate the weighted scores
        const sizeWeightStars = (repo.stars_count / maxStars) || 0;
        const sizeWeightForks = (repo.forks_count / maxForks) || 0;
        const sizeWeightWatchers = (repo.watchers_count / maxWatchers) || 0;
        const starsScore = (repo.stars_last_week ?? 0) / (1 + sizeWeightStars);
        const forksScore = (repo.forks_last_week ?? 0) / (1 + sizeWeightForks);
        const watchersScore = (repo.watchers_last_week ?? 0) / (1 + sizeWeightWatchers);
        const combinedScore = starsScore + forksScore + watchersScore;
        // Check against the thresholds for each metric
        const isTrendingByStars = starsScore >= trendingMetric.stars_threshold;
        const isTrendingByForks = forksScore >= trendingMetric.forks_threshold;
        const isTrendingByWatchers = watchersScore >= trendingMetric.watchers_threshold;
        const isTrendingByCombinedScore = combinedScore >= trendingMetric.combined_threshold;
        // Determine if the repository is trending
        return isTrendingByStars || isTrendingByForks || isTrendingByWatchers || isTrendingByCombinedScore;
    }
}
exports.RepositoryService = RepositoryService;
