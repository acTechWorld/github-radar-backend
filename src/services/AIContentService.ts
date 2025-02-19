import { AppDataSource } from '../db';
import { AIContent } from '../models/AIContent';

export class AIContentService {
  private aiContentRepository = AppDataSource.getRepository(AIContent);

  async getAllAIContents() {
    return await this.aiContentRepository.find();
  }

  async getAIContentById(id: number) {
    return await this.aiContentRepository.findOneBy({ id });
  }

  async createAIContent(data: Partial<AIContent>){
    const newAIContent = this.aiContentRepository.create(data);
    return await this.aiContentRepository.save(newAIContent);
  }

  async updateAIContent(id: number, data: Partial<AIContent>) {
    const aiContent = await this.aiContentRepository.findOneBy({ id });
    if (!aiContent) return null;
    const updatedAIContent = this.aiContentRepository.merge(aiContent, data);
    return await this.aiContentRepository.save(updatedAIContent);
  }

  async deleteAIContent(id: number) {
    const result = await this.aiContentRepository.delete(id);
    return result.affected !== 0;
  }
}
