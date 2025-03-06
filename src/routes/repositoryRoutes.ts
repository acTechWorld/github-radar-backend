// src/routes/repository.routes.ts
import { Router, Request, Response } from 'express';
import { RepositoryService } from '../services/repositoryService';
import { getCleanedReadme } from '../scripts/remorkReadme';

const router = Router();
const repositoryService = new RepositoryService();

// GET /repositories - Get all repositories
router.get('/', async (req: Request, res: Response) => {
  try {
    const repositories = await repositoryService.getAllRepositories(req.query as any);
    res.json(repositories);
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating repository', error:  error.message ?? error });
  }
});

// GET /repositories/:id - Get a repository by ID
router.get('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ message: 'Invalid repository ID' });
    return
  }

  try {
    const repository = await repositoryService.getRepositoryById(id);
    if (!repository) {
      res.status(404).json({ message: 'Repository not found' });
      return
    }
    res.json(repository);
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating repository', error:  error.message ?? error });
  }
});

// POST /repositories - Create a new repository
router.post('/', async (req: Request, res: Response) => {
  try {
    const newRepository = await repositoryService.createRepository(req.body);
    res.status(201).json(newRepository);
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating repository', error:  error.message ?? error });
  }
});

// PUT /repositories/:id - Update a repository
router.put('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ message: 'Invalid repository ID' });
    return
  }

  try {
    const updatedRepository = await repositoryService.updateRepository(id, req.body);
    if (!updatedRepository) {
      res.status(404).json({ message: 'Repository not found' });
      return
    }
    res.json(updatedRepository);
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating repository', error:  error.message ?? error });
  }
});

// DELETE /repositories/:id - Delete a repository
router.delete('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ message: 'Invalid repository ID' });
    return
  }

  try {
    const deleted = await repositoryService.deleteRepository(id);
    if (!deleted) {
      res.status(404).json({ message: 'Repository not found' });
      return
    }
    res.json({ message: 'Repository deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating repository', error:  error.message ?? error });
  }
});


router.post('/get-cleaned-readme', async (req: Request, res: Response) => {
  await getCleanedReadme()
  res.status(200).json(true);
})

export default router;
