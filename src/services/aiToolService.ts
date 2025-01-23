import { Repository } from '../models/Repository'; // Adjust the path to your entity
import { AppDataSource } from '../db';
import { PythonShell } from 'python-shell'; // Import PythonShell

export class AiToolService {
  // Fetch trending repositories
  async fetchTrendingRepositories(): Promise<Repository[]> {
    const repoRepo = AppDataSource.getRepository(Repository);
    return await repoRepo.find({ where: { is_trending: true } });
  }

  // Helper function to run Python script for text generation
  async runPythonScript(prompt: string) {
    try {
      const result= await PythonShell.run('gpt2_script.py', { args: [prompt] })
      return result[0]
    } catch (err) {
      console.error('Error running python script:', err);
    }
  }

  // Extract topics from repository descriptions
  async extractTopicsFromRepos(repos: Repository[]): Promise<string[]> {
    const descriptions = repos.map(repo => repo.description || '').filter(Boolean);
    const topicsSet = new Set<string>();

    for (const description of descriptions) {
      const prompt = `Analyze the following repository description and suggest the main topic it belongs to: "${description}".`;
      
      try {
        const topic = await this.runPythonScript(prompt); // Get topic from GPT-2
        if (topic) topicsSet.add(topic.trim());
      } catch (err) {
        console.error('Error generating topic:', err);
      }
    }

    return Array.from(topicsSet);
  }

  // Generate project ideas for topics
  async generateIdeasForTopics(topics: string[]): Promise<string[]> {
    const ideas: string[] = [];

    for (const topic of topics) {
      const prompt = `Suggest an innovative project idea for the topic: "${topic}".`;
      
      try {
        const idea = await this.runPythonScript(prompt); // Get project idea from GPT-2
        if (idea) ideas.push(idea.trim());
      } catch (err) {
        console.error('Error generating idea:', err);
      }
    }

    return ideas;
  }

  // Analyze trending repositories
  async analyzeTrendingRepositories() {
    const trendingRepos = await this.fetchTrendingRepositories();

    if (trendingRepos.length === 0) {
      throw new Error('No trending repositories found.');
    }

    const topics = await this.extractTopicsFromRepos(trendingRepos);
    const ideas = await this.generateIdeasForTopics(topics);

    return { topics, ideas };
  }
}
