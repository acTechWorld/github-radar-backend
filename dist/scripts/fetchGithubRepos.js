"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCronsFetchGithubRepos = exports.fetchGithubRepos = void 0;
const githubService_1 = require("../services/githubService");
const repositoryService_1 = require("../services/repositoryService");
const trendingMetricService_1 = require("../services/trendingMetricService");
const node_cron_1 = __importDefault(require("node-cron"));
const VUE_QUERY = 'language:Vue stars:>=10';
const REACT_QUERY = 'topic:react stars:>=10 language:Typescript language:Javascript';
const FRANCE_TZ = 'Europe/Paris';
const githubService = new githubService_1.GithubService();
const repositoryService = new repositoryService_1.RepositoryService();
const trendingMetricService = new trendingMetricService_1.TrendingMetricService();
const waitXms = async (Xms) => {
    return new Promise(res => setTimeout(res, Xms));
};
//Cron params min hours * * *
const initCronsFetchGithubRepos = () => {
    //8:13
    node_cron_1.default.schedule('0 10 * * *', () => {
        console.log('Cron job Vue triggered...');
        fetchGithubRepos(VUE_QUERY, 'Vue');
    }, { timezone: FRANCE_TZ });
    node_cron_1.default.schedule('0 6 * * *', () => {
        console.log('Cron job React triggered...');
        fetchGithubRepos(REACT_QUERY, 'React');
    }, { timezone: FRANCE_TZ });
};
exports.initCronsFetchGithubRepos = initCronsFetchGithubRepos;
const fetchGithubRepos = async (query, language) => {
    console.log("init fetchGithubRepos");
    console.log(`init fetching ${language} projects`);
    try {
        // Fetch the first batch of repositories to get the total count and the first set of repositories
        const { total_count: totalProjects } = await githubService.getAllRepositories({
            qSearch: query,
            perPage: 1, // Fetch only the count
            page: 1, // Fetch the first page (only for the count)
        });
        let totalFetched = 0;
        let retryNumber = 0;
        let lastPushed = undefined;
        console.log(`${totalProjects} ${language} projects to fetch`);
        // Check if we need to fetch more repositories
        while (totalFetched < totalProjects) {
            try {
                // Fetch the next batch of repositories using the creation_date filter (last fetched repository date)
                const repos = await githubService.getAllRepositories({
                    qSearch: lastPushed ? `language:${language} stars:>=10 pushed:<=${lastPushed}` : query,
                    perPage: 100,
                    sort: 'updated', // Filter based on the last creation date
                });
                // Process each fetched repository (e.g., save to DB)
                repos.items.forEach((repo) => saveGithubRepoInDb(repo, language));
                totalFetched += repos.items.length; // Increment the count based on fetched items
                console.log(`Fetched: ${totalFetched} repositories`);
                // Update the `lastCreationDate` with the most recent repository's `created_at`
                if (repos.items.length > 0) {
                    lastPushed = repos.items.sort((a, b) => new Date(b.last_pushed) - new Date(a.last_pushed))?.[repos.items.length - 1].last_pushed;
                }
                retryNumber = 0;
                // await waitXms(10 * 1000)
            }
            catch (error) {
                if (error.status === 403) {
                    if (retryNumber < 10) {
                        retryNumber += 1;
                        console.error(`Error fetching repos, (403) wait 5mins and retry (retry number ${retryNumber}):`, error.message);
                        await waitXms(5 * 60 * 1000);
                    }
                    else {
                        console.error("Error fetching repos, (403) max number of retry attempted => finsh job:", error.message);
                        break;
                    }
                }
                else {
                    console.error("Error fetching repos (not 403):", error.message);
                    break;
                }
            }
        }
        //Calculate trending metric and update is_trending field
        const calculatedTrendingMetrics = await trendingMetricService.calculateTrendingMetrics(language);
        await trendingMetricService.createOrUpdateTrendingMetric(language, calculatedTrendingMetrics);
        await repositoryService.updateIsTrendingReposFromLanguage(language);
        console.log("Finished fetching all repositories.");
    }
    catch (error) {
        console.error("Error initializing repository fetch:", error.message);
    }
};
exports.fetchGithubRepos = fetchGithubRepos;
const saveGithubRepoInDb = async (repo, basedLanguage) => {
    const dbRepo = await repositoryService.getRepositoryByGithubId(repo.id);
    const languages = [basedLanguage];
    if (dbRepo && dbRepo.length > 0) {
        //Todo for hasReadMe, isCiCdConfigured  hasTests add a new cron job
        await repositoryService.updateRepository(dbRepo[0].id, {
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
        });
    }
    else {
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
            // is_trending: Boolean(repo.is_trending), // Logic to determine if the repo is trending
        });
    }
};
