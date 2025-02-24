"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIContentService = void 0;
const db_1 = require("../db");
const AIContent_1 = require("../models/AIContent");
class AIContentService {
    aiContentRepository = db_1.AppDataSource.getRepository(AIContent_1.AIContent);
    async getAllAIContents() {
        return await this.aiContentRepository.find();
    }
    async getAIContentById(id) {
        return await this.aiContentRepository.findOneBy({ id });
    }
    async getAIContentByName(name) {
        return await this.aiContentRepository.findOneBy({ name });
    }
    async createAIContent(data) {
        const newAIContent = this.aiContentRepository.create(data);
        return await this.aiContentRepository.save(newAIContent);
    }
    async updateAIContent(id, data) {
        const aiContent = await this.aiContentRepository.findOneBy({ id });
        if (!aiContent)
            return null;
        const updatedAIContent = this.aiContentRepository.merge(aiContent, data);
        return await this.aiContentRepository.save(updatedAIContent);
    }
    async deleteAIContent(id) {
        const result = await this.aiContentRepository.delete(id);
        return result.affected !== 0;
    }
}
exports.AIContentService = AIContentService;
