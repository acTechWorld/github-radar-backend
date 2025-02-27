"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIReposComparaisonService = void 0;
const db_1 = require("../db");
const AIReposComparaison_1 = require("../models/AIReposComparaison");
class AIReposComparaisonService {
    aiReposComparaisonRepository = db_1.AppDataSource.getRepository(AIReposComparaison_1.AIReposComparaison);
    async getAllAIReposComparaisons() {
        return await this.aiReposComparaisonRepository.find();
    }
    async getAIReposComparaisonById(id) {
        return await this.aiReposComparaisonRepository.findOneBy({ id });
    }
    async getAIReposComparaisonByName(name) {
        return await this.aiReposComparaisonRepository.findOneBy({ name });
    }
    async createAIReposComparaison(data) {
        const newAIReposComparaison = this.aiReposComparaisonRepository.create(data);
        return await this.aiReposComparaisonRepository.save(newAIReposComparaison);
    }
    async updateAIReposComparaison(id, data) {
        const aiReposComparaison = await this.aiReposComparaisonRepository.findOneBy({ id });
        if (!aiReposComparaison)
            return null;
        const updatedAIReposComparaison = this.aiReposComparaisonRepository.merge(aiReposComparaison, data);
        return await this.aiReposComparaisonRepository.save(updatedAIReposComparaison);
    }
    async deleteAIReposComparaison(id) {
        const result = await this.aiReposComparaisonRepository.delete(id);
        return result.affected !== 0;
    }
}
exports.AIReposComparaisonService = AIReposComparaisonService;
