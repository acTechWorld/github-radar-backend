import { AppDataSource } from '../db';
import { AIReposComparaison } from '../models/AIReposComparaison';

export class AIReposComparaisonService {
  private aiReposComparaisonRepository = AppDataSource.getRepository(AIReposComparaison);

  async getAllAIReposComparaisons() {
    return await this.aiReposComparaisonRepository.find();
  }

  async getAIReposComparaisonById(id: number) {
    return await this.aiReposComparaisonRepository.findOneBy({ id });
  }

  async getAIReposComparaisonByName(name: string) {
    return await this.aiReposComparaisonRepository.findOneBy({ name });
  }

  async createAIReposComparaison(data: Partial<AIReposComparaison>){
    const newAIReposComparaison = this.aiReposComparaisonRepository.create(data);
    return await this.aiReposComparaisonRepository.save(newAIReposComparaison);
  }

  async updateAIReposComparaison(id: number, data: Partial<AIReposComparaison>) {
    const aiReposComparaison = await this.aiReposComparaisonRepository.findOneBy({ id });
    if (!aiReposComparaison) return null;
    const updatedAIReposComparaison = this.aiReposComparaisonRepository.merge(aiReposComparaison, data);
    return await this.aiReposComparaisonRepository.save(updatedAIReposComparaison);
  }

  async deleteAIReposComparaison(id: number) {
    const result = await this.aiReposComparaisonRepository.delete(id);
    return result.affected !== 0;
  }
}
