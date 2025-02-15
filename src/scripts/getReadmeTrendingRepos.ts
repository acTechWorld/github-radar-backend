
import { LanguageName, TypeTrendingMetrics } from "@/types/types"
import { RepositoryService } from "../services/repositoryService"
import { GithubService } from "../services/githubService"

const repositoryService = new RepositoryService()
const githubService = new GithubService()

const getReadmeTrendingRepos = async (language: LanguageName, typeTrendingMetrics: TypeTrendingMetrics) => {
    const {totalCount} = await repositoryService.getAllRepositories({ languages: language, languagesOperation: 'OR', trendingTypes: typeTrendingMetrics, trendingTypesOperation: 'OR', page: '1', limit: '20'})
    const {items: allRepositories} = await repositoryService.getAllRepositories({ languages: language, languagesOperation: 'OR', trendingTypes: typeTrendingMetrics, trendingTypesOperation: 'OR', page: '1', limit: totalCount.toString()})
    allRepositories.slice(0).forEach(async repo => {
        const readme_content = await githubService.getReadmeFromRepo(allRepositories[0].owner_name, allRepositories[0].name)
        console.log(repo)
        repositoryService.updateRepository(repo.id, {readme_content})
    })
}

export {getReadmeTrendingRepos}