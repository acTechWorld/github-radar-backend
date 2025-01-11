"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguageService = void 0;
// src/services/language.service.ts
const db_1 = require("../db");
const Language_1 = require("../models/Language");
class LanguageService {
    languageRepository = db_1.AppDataSource.getRepository(Language_1.Language);
    async getAllLanguages() {
        return await this.languageRepository.find();
    }
    async getLanguageById(id) {
        return await this.languageRepository.findOneBy({ id });
    }
    async createLanguage(data) {
        const newLanguage = this.languageRepository.create(data);
        return await this.languageRepository.save(newLanguage);
    }
    async updateLanguage(id, data) {
        const language = await this.languageRepository.findOneBy({ id });
        if (!language)
            return null;
        const updatedLanguage = this.languageRepository.merge(language, data);
        return await this.languageRepository.save(updatedLanguage);
    }
    async deleteLanguage(id) {
        const result = await this.languageRepository.delete(id);
        return result.affected !== 0;
    }
}
exports.LanguageService = LanguageService;
