const axios = require('axios');
require('dotenv').config();

const GITHUB_API_URL = process.env.GITHUB_API_URL;
const GITHUB_TOKEN = process.env.GITHUB_API_TOKEN;

// Fetch repositories by language
const fetchRepositoriesBySearch = async (qSearch: string, page = 1, perPage = 30, sort: 'stars' | 'updated' | 'full_name' = 'stars') => {
    if (!GITHUB_TOKEN) {
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
        Authorization: `Bearer ${GITHUB_TOKEN}`, // Include the token in the Authorization header
      },
    });
    // console.log(response)
    return {
      total_count: response.data.total_count, 
      items: response.data.items
    }; // Return array of repositories
}



export { fetchRepositoriesBySearch};
