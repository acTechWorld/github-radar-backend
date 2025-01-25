"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiToolService = void 0;
const Repository_1 = require("../models/Repository"); // Adjust the path to your entity
const db_1 = require("../db");
const python_shell_1 = require("python-shell"); // Import PythonShell
class AiToolService {
    // Fetch trending repositories
    async fetchTrendingRepositories() {
        const repoRepo = db_1.AppDataSource.getRepository(Repository_1.Repository);
        return await repoRepo.find({ where: { is_trending: true } });
    }
    // Helper function to run Python script for text generation
    async runPythonScript(prompt) {
        try {
            const result = await python_shell_1.PythonShell.run('gpt2_script.py', { args: [prompt] });
            return result[0];
        }
        catch (err) {
            console.error('Error running python script:', err);
        }
    }
    // Extract topics from repository descriptions
    async extractTopicsFromRepos(repos) {
        const descriptions = repos.map(repo => repo.description || '').filter(Boolean);
        const topicsSet = new Set();
        for (const description of descriptions) {
            const prompt = `Analyze the following repository description and suggest the main topic it belongs to: "${description}".`;
            try {
                const topic = await this.runPythonScript(prompt); // Get topic from GPT-2
                if (topic)
                    topicsSet.add(topic.trim());
            }
            catch (err) {
                console.error('Error generating topic:', err);
            }
        }
        return Array.from(topicsSet);
    }
    // Generate project ideas for topics
    async generateIdeasForTopics(topics) {
        const ideas = [];
        for (const topic of topics) {
            const prompt = `Suggest an innovative project idea for the topic: "${topic}".`;
            try {
                const idea = await this.runPythonScript(prompt); // Get project idea from GPT-2
                if (idea)
                    ideas.push(idea.trim());
            }
            catch (err) {
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
exports.AiToolService = AiToolService;
