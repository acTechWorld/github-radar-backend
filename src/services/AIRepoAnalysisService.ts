import { AppDataSource } from '../db';
import { AIRepoAnalysis } from '../models/AIRepoAnalysis';

export class AIRepoAnalysisService {
  private aiRepoAnalysisRepository = AppDataSource.getRepository(AIRepoAnalysis);

  async getAllAIRepoAnalyses() {
    return await this.aiRepoAnalysisRepository.find();
  }

  async getAIRepoAnalysisById(id: number) {
    return await this.aiRepoAnalysisRepository.findOneBy({ id });
  }

  async getAIRepoAnalysisByNameAndOwner(repo_name: string, repo_owner: string) {
    return await this.aiRepoAnalysisRepository.findOneBy({ repo_name, repo_owner });
  }

  async createAIRepoAnalysis(data: Partial<AIRepoAnalysis>) {
    const newAIRepoAnalysis = this.aiRepoAnalysisRepository.create(data);
    return await this.aiRepoAnalysisRepository.save(newAIRepoAnalysis);
  }

  async updateAIRepoAnalysis(id: number, data: Partial<AIRepoAnalysis>) {
    const aiRepoAnalysis = await this.aiRepoAnalysisRepository.findOneBy({ id });
    if (!aiRepoAnalysis) return null;
    const updatedAIRepoAnalysis = this.aiRepoAnalysisRepository.merge(aiRepoAnalysis, data);
    return await this.aiRepoAnalysisRepository.save(updatedAIRepoAnalysis);
  }

  async deleteAIRepoAnalysis(id: number) {
    const result = await this.aiRepoAnalysisRepository.delete(id);
    return result.affected !== 0;
  }
}
