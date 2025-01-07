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
    console.log(response.data.items.map((i:any) => i.pushed_at))
    return {
      total_count: response.data.total_count, 
      items: response.data.items
    }; // Return array of repositories
}

const hasReadMe = async (ownerLogin: string, repoName: string) => {
    if (!GITHUB_TOKEN) {
      throw new Error('GitHub API token is not defined.');
    }
    const readme = await axios.get(`${GITHUB_API_URL}/repos/${ownerLogin}/${repoName}/contents/README.md`, 
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`, // Include the token in the Authorization header
        }
      });
    return !!readme
}

async function isCiCdConfigured(ownerLogin: string, repoName: string): Promise<boolean> {
    // Fetch the contents of the repository root
    const rootContentsResponse = await axios.get(
      `https://api.github.com/repos/${ownerLogin}/${repoName}/contents`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
        },
      }
    );

    // Extract file paths from the root contents
    const rootFiles = rootContentsResponse.data.map((file: any) => file.path);

    // Check for common CI/CD configuration files in the root
    const ciCdFiles = [
      '.travis.yml',
      '.gitlab-ci.yml',
      'Jenkinsfile',
      'azure-pipelines.yml',
      'docker-compose.yml',
    ];

    const hasRootCiCdFiles = ciCdFiles.some((ciCdFile) => rootFiles.includes(ciCdFile));

    // If found in the root, return true
    if (hasRootCiCdFiles) {
      return true;
    }

    // Fetch the contents of the `.github/workflows` directory (for GitHub Actions)
    try {
      const workflowsResponse = await axios.get(
        `https://api.github.com/repos/${ownerLogin}/${repoName}/contents/.github/workflows`,
        {
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
          },
        }
      );

      // If there are files in the `.github/workflows` directory, GitHub Actions is configured
      return workflowsResponse.data.length > 0;
    } catch (workflowError: any) {
      if (workflowError.response?.status === 404) {
        // `.github/workflows` folder does not exist
        return false;
      }
      throw workflowError; // Re-throw unexpected errors
    }
}

async function hasTests(ownerLogin: string, repoName: string): Promise<boolean> {
    // Fetch the contents of the repository root
    const rootContentsResponse = await axios.get(
      `https://api.github.com/repos/${ownerLogin}/${repoName}/contents`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
        },
      }
    );

    // Extract file and folder paths from the root contents
    const rootFiles = rootContentsResponse.data.map((file: any) => file.path);

    // Common test file and directory names
    const testFilesAndDirs = [
      'test',
      'tests',
      'spec',
      'specs',
      'unittest',
      '__tests__',
      'pytest.ini',
      'jest.config.js',
      'karma.conf.js',
      'mocha.opts',
    ];

    // Check for the presence of test-related files or directories in the root
    const hasRootTests = testFilesAndDirs.some((testFileOrDir) => rootFiles.includes(testFileOrDir));

    if (hasRootTests) {
      return true;
    }

    // Check for `test`, `tests`, or `__tests__` directories recursively
    const testDirectories = ['test', 'tests', '__tests__'];

    for (const testDir of testDirectories) {
      try {
        const testDirResponse = await axios.get(
          `https://api.github.com/repos/${ownerLogin}/${repoName}/contents/${testDir}`,
          {
            headers: {
              Authorization: `Bearer ${GITHUB_TOKEN}`,
            },
          }
        );

        // If the directory exists and contains files, return true
        if (testDirResponse.data.length > 0) {
          return true;
        }
      } catch (dirError: any) {
        if (dirError.response?.status === 404) {
          // Directory does not exist, continue checking other directories
          continue;
        }
        throw dirError; // Re-throw unexpected errors
      }
    }

    // No test files or directories found
    return false;
}


export { fetchRepositoriesBySearch, hasReadMe, isCiCdConfigured, hasTests};
