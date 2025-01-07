import { GithubService } from "../services/githubService"
import { GithubApiRepo } from "../types/types"
import { RepositoryService } from "../services/repositoryService"
import { time } from "console"
const VUE_QUERY = 'language:Vue stars:>=10'
const githubService= new GithubService()
const repositoryService = new RepositoryService()

const fetchGithubRepos =  async () => {
    console.log("init fetchGithubRepos");
    console.log("init fetching vue projects");
  
    try {
      // Fetch the first batch of repositories to get the total count and the first set of repositories
      const { total_count: totalVueProjects } = await githubService.getAllRepositories({
        qSearch: VUE_QUERY,
        perPage: 1, // Fetch only the count
        page: 1,    // Fetch the first page (only for the count)
      });
      
      let totalFetched = 0;
      let lastPushed: string | undefined = undefined;
  
      console.log(`${totalVueProjects} Vue projects to fetch`);
      
      const totalVueProjects2 = 100
      // Check if we need to fetch more repositories
      while (totalFetched < totalVueProjects2) {
        try {
          // Fetch the next batch of repositories using the creation_date filter (last fetched repository date)
          const repos = await githubService.getAllRepositories({
            qSearch: lastPushed ? `language:Vue stars:>=10 pushed:<=${lastPushed}` : VUE_QUERY,
            perPage: 100,
            sort: 'updated', // Filter based on the last creation date
          });
  
          // Process each fetched repository (e.g., save to DB)
          repos.items.forEach((repo) => saveGithubRepoInDb(repo));
          totalFetched += repos.items.length; // Increment the count based on fetched items
  
          console.log(`Fetched: ${totalFetched} repositories`);
  
          // Update the `lastCreationDate` with the most recent repository's `created_at`
          if (repos.items.length > 0) {
            lastPushed = repos.items.sort((a,b) => (new Date(b.last_pushed) as any) - (new Date(a.last_pushed) as any))?.[repos.items.length - 1].last_pushed;
          }
          
        } catch (error: any) {
          console.error("Error fetching repositories:", error.message);
          break; // Optionally break out of the loop if an error occurs
        }
      }
  
      console.log("Finished fetching all repositories.");
    } catch (error: any) {
      console.error("Error initializing repository fetch:", error.message);
    }
  };
  

const saveGithubRepoInDb = async (repo: GithubApiRepo) => {
    try {
        const dbRepo = await repositoryService.getRepositoryByGithubId(repo.id);
        if(dbRepo && dbRepo.length > 0) {
          //Todo for hasReadMe, isCiCdConfigured  hasTests add a new cron job
            await repositoryService.updateRepository(
                repo.id,
                {
                    github_id: repo.id,
                    name: repo.name,
                    description: repo.description || undefined,
                    html_url: repo.html_url,
                    owner_name: repo.owner_name,
                    owner_avatar_url: repo.owner_avatar_url || undefined,
                    stars_count: repo.stars_count,
                    forks_count: repo.forks_count,
                    open_issues_count: repo.open_issues_count || undefined,
                    languages: ['Vue'], 
                    license: repo.license || undefined,
                    topics: repo.topics || [],
                    creation_date: new Date(repo.creation_date),
                    last_updated: new Date(repo.last_updated),
                    owner_type: repo.owner_type || undefined,
                    // has_tests: Boolean(repo.has_tests), // Logic to determine if tests exist
                    // is_trending: Boolean(repo.is_trending), // Logic to determine if the repo is trending
                    // stars_last_week: repo.stars_last_week || null,
                }
            )
        } else {
            const has_readme = await githubService.hasReadMe(repo.owner_name, repo.name)
            const ci_cd_configured = await githubService.isCiCdConfigured(repo.owner_name, repo.name)
            const has_tests = await githubService.hasTests(repo.owner_name, repo.name)
             await repositoryService.createRepository({
                github_id: repo.id,
                name: repo.name,
                description: repo.description || undefined,
                html_url: repo.html_url,
                owner_name: repo.owner_name,
                owner_avatar_url: repo.owner_avatar_url || undefined,
                stars_count: repo.stars_count,
                forks_count: repo.forks_count,
                open_issues_count: repo.open_issues_count || undefined,
                languages: ['Vue'], 
                license: repo.license || undefined,
                topics: repo.topics || [],
                creation_date: new Date(repo.creation_date),
                last_updated: new Date(repo.last_updated),
                owner_type: repo.owner_type || undefined,
                has_readme,
                ci_cd_configured,
                has_tests,
                // is_trending: Boolean(repo.is_trending), // Logic to determine if the repo is trending
            })
        }
    } catch (error) {
        console.log(error)
    }
}

export {fetchGithubRepos}