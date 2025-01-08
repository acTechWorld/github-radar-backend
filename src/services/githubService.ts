import {fetchRepositoriesBySearch, fetchRepoContents} from '../api/githubApi'
import { GithubApiRepo, GithubRepoQuery } from '../types/types';

// Intermediate service method to fetch repositories
//TODO MERGE LOGIC ALL CALLS FOR CONTENTS INTO ONE BIGGER METHOD IN SERVICE

export class GithubService {
    async getAllRepositories(
       queries: GithubRepoQuery
      ): Promise<{items: GithubApiRepo[], total_count: number} >{
          const res = await fetchRepositoriesBySearch(queries.qSearch, queries.page, queries.perPage, queries.sort);
          // Map the GitHub API response to the Repo type
          return {
            ...res, 
            items: res.items.map((repo: any): GithubApiRepo => ({
                id: repo.id,
                name: repo.name,
                full_name: repo.full_name,
                description: repo.description || null,
                stars_count: repo.stargazers_count,
                forks_count: repo.forks_count,
                html_url: repo.html_url,
                owner_name: repo.owner.login,
                owner_avatar_url: repo.owner.avatar_url,
                license: repo.license?.name || null,
                topics: repo.topics || [],
                creation_date: repo.created_at,
                last_updated: repo.updated_at,
                last_pushed: repo.pushed_at,
                open_issues_count: repo.open_issues,
                owner_type: repo.owner.type || null,
            }))
        }
    }
    checkReadMe(rootFiles: string[]): boolean {
      return rootFiles.includes('README.md');
    }
      
    checkCiCdConfigured(rootFiles: string[], ownerLogin: string, repoName: string): Promise<boolean> {
        const ciCdFiles = [
          '.travis.yml',
          '.gitlab-ci.yml',
          'Jenkinsfile',
          'azure-pipelines.yml',
          'docker-compose.yml',
        ];
      
        // Check for CI/CD files in the root
        if (ciCdFiles.some((ciCdFile) => rootFiles.includes(ciCdFile))) {
          return Promise.resolve(true);
        }
      
        // Check for workflows in `.github/workflows`
        return fetchRepoContents(ownerLogin, repoName, '.github/workflows').then((workflows) => workflows.length > 0);
      }
      
     async checkHasTests(rootFiles: string[], ownerLogin: string, repoName: string): Promise<boolean> {
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
      
        // Check for test files or directories in the root
        if (testFilesAndDirs.some((testFileOrDir) => rootFiles.includes(testFileOrDir))) {
          return true;
        }
      
        // Check for specific test directories recursively
        const testDirectories = ['test', 'tests', '__tests__'];
        for (const testDir of testDirectories) {
          const testDirContents = await fetchRepoContents(ownerLogin, repoName, testDir);
          if (testDirContents.length > 0) {
            return true;
          }
        }
      
        return false;
      }
      
      async evaluateRepositoryFeatures(
        ownerLogin: string,
        repoName: string
      ): Promise<{
        hasReadMe: boolean;
        ciCdConfigured: boolean;
        hasTests: boolean;
      }> {
      
        try {
          const rootContents = await fetchRepoContents(ownerLogin, repoName);
          const rootFiles = rootContents.map((file: any) => file.path);
      
          const hasReadMe = this.checkReadMe(rootFiles);
          const ciCdConfigured = await this.checkCiCdConfigured(rootFiles, ownerLogin, repoName);
          const hasTests = await this.checkHasTests(rootFiles, ownerLogin, repoName);
      
          return {
            hasReadMe,
            ciCdConfigured,
            hasTests,
          };
        } catch (error: any) {
          if (error.response?.status !== 404) {
            console.error(`Error evaluating repository ${ownerLogin}/${repoName}:`, error);          
          }
          return {
            hasReadMe: false,
            ciCdConfigured: false,
            hasTests: false,
          };
        }
      }
}
