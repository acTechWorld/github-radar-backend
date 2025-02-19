import { GithubService } from "../services/githubService"
import { GithubApiRepo, LanguageName, TypeTrendingMetrics } from "../types/types"
import { RepositoryService } from "../services/repositoryService"
import { TrendingMetricService } from "../services/trendingMetricService"
import logger from "../utils/logger"
const VUE_QUERY = 'language:Vue stars:>=10'
const REACT_QUERY = 'topic:react stars:>=10 language:Typescript language:Javascript'
const FRANCE_TZ = 'Europe/Paris';

const githubService= new GithubService()
const repositoryService = new RepositoryService()
const trendingMetricService = new TrendingMetricService()


const queryMapper = {
  Vue: VUE_QUERY,
  React: REACT_QUERY
}
const waitXms = async (Xms: number) => {
  return new Promise(res => setTimeout(res, Xms))
}

const fetchGithubRepos =  async (language: LanguageName) => {
  logger.log("INFO", `init fetching ${language} projects`);

  const query = queryMapper[language]
  if(query) {
    try {
      // Fetch the first batch of repositories to get the total count and the first set of repositories
      const { total_count: totalProjects } = await githubService.getAllRepositories({
        qSearch: query,
        perPage: 1, // Fetch only the count
        page: 1,    // Fetch the first page (only for the count)
      });
      
      let totalFetched = 0;
      let retryNumber = 0;
      let lastPushed: string | undefined = undefined;
  
      logger.log("INFO", `${totalProjects} ${language} projects to fetch`);
      // Check if we need to fetch more repositories
      // while (totalFetched < totalProjects) {
      //   try {
      //     let startFetchBatch, fetchBatchDuration;
      //     if (process.env.DEBUG) startFetchBatch = Date.now();
      //     // Fetch the next batch of repositories using the creation_date filter (last fetched repository date)
      //     const repos = await githubService.getAllRepositories({
      //       qSearch: lastPushed ? `${query} pushed:<=${lastPushed}` : query,
      //       perPage: 100,
      //       sort: 'updated', // Filter based on the last creation date
      //     });

      //     if (process.env.DEBUG && startFetchBatch) {
      //       fetchBatchDuration = Date.now() - startFetchBatch;
      //       logger.log("DEBUG", `Fetched ${repos.items.length} repositories (API call took ${fetchBatchDuration}ms)`);
      //     }
      //     // Process each fetched repository (e.g., save to DB)
      //     repos.items.forEach((repo) => saveGithubRepoInDb(repo, language));
      //     totalFetched += repos.items.length; // Increment the count based on fetched items
  
      //     logger.log("INFO", `Fetched: ${totalFetched} repositories`);
      //     // Update the `lastCreationDate` with the most recent repository's `created_at`
      //     if (repos.items.length > 0) {
      //       lastPushed = repos.items.sort((a,b) => (new Date(b.last_pushed) as any) - (new Date(a.last_pushed) as any))?.[repos.items.length - 1].last_pushed;
      //     }
      //     retryNumber = 0
      //     await waitXms(10 * 1000)
  
      //   } catch (error: any) {
      //     if(error.status === 403) {
      //       if(retryNumber < 10) {
      //         retryNumber += 1
      //         logger.log("ERROR", `Error fetching repos, (403) wait 5mins and retry (retry number ${retryNumber}): ${error.message}`);
      //         await waitXms(5 * 60 * 1000)
      //       } else {
      //         logger.log("ERROR",`Error fetching repos, (403) max number of retry attempted => finsh job: ${error.message}`);
      //         break;
      //       }
      //     } else {
      //       logger.log("ERROR", `Error fetching repos (not 403): ${error.message}`);
      //       break
      //     }
      //   }
      // }
      logger.log("INFO", "Finished fetching all repositories.");
      
      //Clear existing trendingMetric repos
      trendingMetricService.clearTrendingMetricRepos({language: language})

      const trendingMetricsTypes: TypeTrendingMetrics[] = ['global', 'last_6_months']
      for(const trendingMetricsType of trendingMetricsTypes) {
        logger.log("INFO", `Calculate trending metric for ${language} and metric type ${trendingMetricsType}`);
        const calculatedTrendingMetrics = await trendingMetricService.calculateTrendingMetrics(language, trendingMetricService.generateFiltersRepoFromTrendingMetricType(trendingMetricsType))
        await trendingMetricService.createOrUpdateTrendingMetric(language, {...calculatedTrendingMetrics, type : trendingMetricsType})
        logger.log("INFO", `Update isTrending for repos of ${language} and metric type ${trendingMetricsType}`);
        await repositoryService.updateIsTrendingReposFromTrendingLanguageType(language, trendingMetricsType, trendingMetricService.generateFiltersRepoFromTrendingMetricType(trendingMetricsType))
        logger.log("INFO", `Get Readme files for repos of ${language} and metric type ${trendingMetricsType}`);
        await getReadmeTrendingRepos(language, trendingMetricsType)
      }
    } catch (error: any) {
      logger.log("ERROR", `Error initializing repository fetch: ${error.message}`);
    }
  } else {
    logger.log('ERROR', `No query found for language: ${language}`)
  }
};
  

const saveGithubRepoInDb = async (repo: GithubApiRepo, basedLanguage: string) => {
  const dbRepo = await repositoryService.getRepositoryByGithubId(repo.id);
  const languages = [basedLanguage]
  if(dbRepo && dbRepo.length > 0) {
    //Todo for hasReadMe, isCiCdConfigured  hasTests add a new cron job
    await repositoryService.updateRepository(
      dbRepo[0].id,
      {
          github_id: repo.id,
          name: repo.name,
          description: repo.description || undefined,
          html_url: repo.html_url,
          owner_name: repo.owner_name,
          owner_avatar_url: repo.owner_avatar_url || undefined,
          stars_count: repo.stars_count,
          forks_count: repo.forks_count,
          watchers_count: repo.watchers_count,
          open_issues_count: repo.open_issues_count || undefined,
          languages: languages, 
          license: repo.license || undefined,
          topics: repo.topics || [],
          creation_date: new Date(repo.creation_date),
          last_updated: new Date(repo.last_updated),
          owner_type: repo.owner_type || undefined,
      }
  )
  } else {
      // const features = await githubService.evaluateRepositoryFeatures(repo.owner_name, repo.name)
      await repositoryService.createRepository({
        github_id: repo.id,
        name: repo.name,
        description: repo.description || undefined,
        html_url: repo.html_url,
        owner_name: repo.owner_name,
        owner_avatar_url: repo.owner_avatar_url || undefined,
        stars_count: repo.stars_count,
        forks_count: repo.forks_count,
        watchers_count: repo.watchers_count,
        open_issues_count: repo.open_issues_count || undefined,
        languages: languages, 
        license: repo.license || undefined,
        topics: repo.topics || [],
        creation_date: new Date(repo.creation_date),
        last_updated: new Date(repo.last_updated),
        owner_type: repo.owner_type || undefined,
      })
  }
    
}

const getReadmeTrendingRepos = async (language: LanguageName, typeTrendingMetrics: TypeTrendingMetrics) => {
    const {totalCount} = await repositoryService.getAllRepositories({ languages: language, languagesOperation: 'OR', trendingTypes: typeTrendingMetrics, trendingTypesOperation: 'OR', page: '1', limit: '20'})
    const {items: allRepositories} = await repositoryService.getAllRepositories({ languages: language, languagesOperation: 'OR', trendingTypes: typeTrendingMetrics, trendingTypesOperation: 'OR', page: '1', limit: totalCount.toString()})
    for(const repo of allRepositories){
      if(!repo.readme_content || repo.last_update_readme < repo.last_updated) {
            logger.log("DEBUG", `Search read me for ${repo.name}`)
            const readme_content = await githubService.getReadmeFromRepo(repo.owner_name, repo.name)
            logger.log("DEBUG", `Found read me for ${repo.name}: ${readme_content !== null}`)
            repositoryService.updateRepository(repo.id, {readme_content, last_update_readme: new Date()})
        }
    }
}

export {fetchGithubRepos}