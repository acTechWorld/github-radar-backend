"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReadme = exports.fetchRepositoriesBySearch = void 0;
const axios = require('axios');
require('dotenv').config();
const GITHUB_API_URL = process.env.GITHUB_API_URL;
const GITHUB_TOKEN = process.env.GITHUB_API_TOKEN;
// Fetch repositories by language
const fetchRepositoriesBySearch = async (qSearch, page = 1, perPage = 30, sort = 'stars') => {
    if (!GITHUB_TOKEN) {
        throw new Error('GitHub API token is not defined.');
    }
    const params = {
        q: qSearch,
        sort, // Sort by creation date
        per_page: perPage
    };
    const response = await axios.get(`${GITHUB_API_URL}/search/repositories`, {
        params,
        headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`, // Include the token in the Authorization header
        },
    });
    return {
        total_count: response.data.total_count,
        items: response.data.items
    }; // Return array of repositories
};
exports.fetchRepositoriesBySearch = fetchRepositoriesBySearch;
const getReadme = async (owner, repo_name, readmeFileName) => {
    if (!GITHUB_TOKEN) {
        throw new Error('GitHub API token is not defined.');
    }
    const url = `${GITHUB_API_URL}/repos/${owner}/${repo_name}/contents/${readmeFileName}`;
    const response = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: 'application/vnd.github.v3+json',
        },
    });
    // Decode base64 content from GitHub API
    const readmeContent = Buffer.from(response.data.content, 'base64').toString('utf-8');
    return {
        name: response.data.name,
        path: response.data.path,
        download_url: response.data.download_url,
        content: readmeContent,
    };
};
exports.getReadme = getReadme;
