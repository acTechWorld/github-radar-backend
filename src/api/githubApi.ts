const axios = require('axios');
require('dotenv').config();

const GITHUB_API_URL = process.env.GITHUB_API_URL;
const githubToken = process.env.GITHUB_API_TOKEN;


// Fetch repositories by language
const fetchRepositoriesBySearch = async (qSearch: string, page = 1, perPage = 30, sort: 'stars' | 'updated' | 'full_name' = 'stars') => {
  console.log(qSearch)
    if (!githubToken) {
      throw new Error('GitHub API token is not defined.');
    }

    const params: any = {
      q: qSearch,
      sort,   // Sort by creation date
      per_page: perPage
    };

    const response = await axios.get(`${GITHUB_API_URL}/search/repositories`, {
      params,
      headers: {
        Authorization: `Bearer ${githubToken}`, // Include the token in the Authorization header
      },
    });
    console.log(response.data.items.map((i:any) => i.pushed_at))
    return {
      total_count: response.data.total_count, 
      items: response.data.items
    }; // Return array of repositories
}

const isReadMe = async (ownerLogin: string, repoName: string) => {
    if (!githubToken) {
      throw new Error('GitHub API token is not defined.');
    }
    const readme = await axios.get(`${GITHUB_API_URL}/repos/${ownerLogin}/${repoName}/contents/README.md`, 
      {
        headers: {
          Authorization: `Bearer ${githubToken}`, // Include the token in the Authorization header
        }
      });
    return !!readme
}

export { fetchRepositoriesBySearch, isReadMe };
