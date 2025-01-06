import {fetchRepositoriesBySearch, isReadMe} from '../api/githubApi'
import { GithubApiRepo, GithubRepoQuery } from '../types/types';

// Intermediate service method to fetch repositories

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
                // ci_cd_configured: Boolean(repo.ci_cd_configured), // Logic to determine if CI/CD is configured
                // has_tests: Boolean(repo.has_tests), // Logic to determine if tests exist
                // is_trending: Boolean(repo.is_trending), // Logic to determine if the repo is trending
                // stars_last_week: repo.stars_last_week || null,
            }))
        }
      }
    async isReadMe(ownerLogin: string, repoName: string){
        try {
            return await isReadMe(ownerLogin, repoName)
          } catch (error: any) {
            return false
          }
    }
}
