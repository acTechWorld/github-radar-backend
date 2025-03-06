import { cleanText } from "../utils/utils"
import { RepositoryService } from "../services/repositoryService"
const repositoryService = new RepositoryService()

const getCleanedReadme = async () => {
    const repos = await repositoryService.getAllRepositories({hasReadMe: "true", page: "1", limit: "20"})

    repos.items?.forEach(async repo => {
        const cleanedReadme = cleanText(repo.readme_content ?? '')  
        await repositoryService.updateRepository(repo.id, {cleaned_readme_content: cleanedReadme})
    })    
}

export {getCleanedReadme}