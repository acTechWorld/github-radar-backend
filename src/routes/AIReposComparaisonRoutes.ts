import { Router } from 'express';
import { AIReposComparaisonService } from '../services/AIReposComparaisonService';

const router = Router();
const aiReposComparaisonService = new AIReposComparaisonService();

// GET /ai-repos-comparaison - Get all AIReposComparaison
router.get('/', async (req, res) => {
  try {
    const reposComparaisons = await aiReposComparaisonService.getAllAIReposComparaisons();
    res.json(reposComparaisons);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching AI reposComparaison', error: error.message ?? error });
  }
});

// GET /aiReposComparaison/:id - Get AIReposComparaison by ID
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ message: 'Invalid AI reposComparaison ID' });
    return;
  }

  try {
    const reposComparaison = await aiReposComparaisonService.getAIReposComparaisonById(id);
    if (!reposComparaison) {
      res.status(404).json({ error: 'AI reposComparaison not found.' });
      return;
    }
    res.json(reposComparaison);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching AI reposComparaison', error: error.message ?? error });
  }
});

// GET /aiReposComparaison/name/:name - Get AIReposComparaison by NAME
router.get('/name/:name', async (req, res) => {
  try {
    const reposComparaison = await aiReposComparaisonService.getAIReposComparaisonByName(req.params.name);
    if (!reposComparaison) {
      res.status(404).json({ error: 'AI reposComparaison not found.' });
      return;
    }
    res.json(reposComparaison);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching AI reposComparaison', error: error.message ?? error });
  }
});

// POST /aiReposComparaison - Create a new AIReposComparaison
router.post('/', async (req, res) => {
  try {
    const newReposComparaison = await aiReposComparaisonService.createAIReposComparaison(req.body);
    res.status(201).json(newReposComparaison);
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating AI reposComparaison', error: error.message ?? error });
  }
});

// PUT /aiReposComparaison/:id - Update an existing AIReposComparaison
router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ message: 'Invalid AI reposComparaison ID' });
    return;
  }

  try {
    const updatedReposComparaison = await aiReposComparaisonService.updateAIReposComparaison(id, req.body);
    if (!updatedReposComparaison) {
      res.status(404).json({ error: 'AI reposComparaison not found.' });
      return;
    }
    res.json(updatedReposComparaison);
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating AI reposComparaison', error: error.message ?? error });
  }
});

// DELETE /aiReposComparaison/:id - Delete an AIReposComparaison
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ message: 'Invalid AI reposComparaison ID' });
    return;
  }

  try {
    const deleted = await aiReposComparaisonService.deleteAIReposComparaison(id);
    if (!deleted) {
      res.status(404).json({ error: 'AI reposComparaison not found.' });
      return;
    }
    res.status(204).send(); // No reposComparaison response
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting AI reposComparaison', error: error.message ?? error });
  }
});

export default router;
