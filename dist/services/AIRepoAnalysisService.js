"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIRepoAnalysisService = void 0;
const db_1 = require("../db");
const AIRepoAnalysis_1 = require("../models/AIRepoAnalysis");
class AIRepoAnalysisService {
    aiRepoAnalysisRepository = db_1.AppDataSource.getRepository(AIRepoAnalysis_1.AIRepoAnalysis);
    async getAllAIRepoAnalyses() {
        return await this.aiRepoAnalysisRepository.find();
    }
    async getAIRepoAnalysisById(id) {
        return await this.aiRepoAnalysisRepository.findOneBy({ id });
    }
    async getAIRepoAnalysisByNameAndOwner(repo_name, repo_owner) {
        return await this.aiRepoAnalysisRepository.findOneBy({ repo_name, repo_owner });
    }
    async createAIRepoAnalysis(data) {
        const newAIRepoAnalysis = this.aiRepoAnalysisRepository.create(data);
        return await this.aiRepoAnalysisRepository.save(newAIRepoAnalysis);
    }
    async updateAIRepoAnalysis(id, data) {
        const aiRepoAnalysis = await this.aiRepoAnalysisRepository.findOneBy({ id });
        if (!aiRepoAnalysis)
            return null;
        const updatedAIRepoAnalysis = this.aiRepoAnalysisRepository.merge(aiRepoAnalysis, data);
        return await this.aiRepoAnalysisRepository.save(updatedAIRepoAnalysis);
    }
    async deleteAIRepoAnalysis(id) {
        const result = await this.aiRepoAnalysisRepository.delete(id);
        return result.affected !== 0;
    }
}
exports.AIRepoAnalysisService = AIRepoAnalysisService;
