"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCleanedReadme = void 0;
const utils_1 = require("../utils/utils");
const repositoryService_1 = require("../services/repositoryService");
const repositoryService = new repositoryService_1.RepositoryService();
const getCleanedReadme = async () => {
    const repos = await repositoryService.getAllRepositories({ hasReadMe: "true", page: "1", limit: "20" });
    repos.items?.forEach(async (repo) => {
        const cleanedReadme = (0, utils_1.cleanText)(repo.readme_content ?? '');
        await repositoryService.updateRepository(repo.id, { cleaned_readme_content: cleanedReadme });
    });
};
exports.getCleanedReadme = getCleanedReadme;
