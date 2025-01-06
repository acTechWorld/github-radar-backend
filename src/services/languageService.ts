// src/services/language.service.ts
import { AppDataSource } from '../db';
import { Language } from '../models/language';

export class LanguageService {
  private languageRepository = AppDataSource.getRepository(Language);

  async getAllLanguages() {
    return await this.languageRepository.find();
  }

  async getLanguageById(id: number) {
    return await this.languageRepository.findOneBy({ id });
  }

  async createLanguage(data: Partial<Language>){
    const newLanguage = this.languageRepository.create(data);
    return await this.languageRepository.save(newLanguage);
  }

  async updateLanguage(id: number, data: Partial<Language>) {
    const language = await this.languageRepository.findOneBy({ id });
    if (!language) return null;
    const updatedLanguage = this.languageRepository.merge(language, data);
    return await this.languageRepository.save(updatedLanguage);
  }

  async deleteLanguage(id: number) {
    const result = await this.languageRepository.delete(id);
    return result.affected !== 0;
  }
}
