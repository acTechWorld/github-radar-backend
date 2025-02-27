import { Router } from 'express';
import { AIRepoAnalysisService } from '../services/AIRepoAnalysisService';

const router = Router();
const aiRepoAnalysisService = new AIRepoAnalysisService();

// GET /aiRepoAnalysis - Get all AIRepoAnalysis
router.get('/', async (req, res) => {
  try {
    const analyses = await aiRepoAnalysisService.getAllAIRepoAnalyses();
    res.json(analyses);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching AI repo analyses', error: error.message ?? error });
  }
});

// GET /aiRepoAnalysis/:id - Get AIRepoAnalysis by ID
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ message: 'Invalid AI repo analysis ID' });
    return;
  }

  try {
    const analysis = await aiRepoAnalysisService.getAIRepoAnalysisById(id);
    if (!analysis) {
      res.status(404).json({ error: 'AI repo analysis not found.' });
      return;
    }
    res.json(analysis);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching AI repo analysis', error: error.message ?? error });
  }
});

// GET /aiRepoAnalysis/name/:name/owner/:owner - Get AIRepoAnalysis by NAME and OWNER
router.get('/name/:name/owner/:owner', async (req, res) => {
  try {
    const { name, owner } = req.params;
    const analysis = await aiRepoAnalysisService.getAIRepoAnalysisByNameAndOwner(name, owner);
    if (!analysis) {
      res.status(404).json({ error: 'AI repo analysis not found.' });
      return;
    }
    res.json(analysis);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching AI repo analysis', error: error.message ?? error });
  }
});

// POST /aiRepoAnalysis - Create a new AIRepoAnalysis
router.post('/', async (req, res) => {
  try {
    const newAnalysis = await aiRepoAnalysisService.createAIRepoAnalysis(req.body);
    res.status(201).json(newAnalysis);
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating AI repo analysis', error: error.message ?? error });
  }
});

// PUT /aiRepoAnalysis/:id - Update an existing AIRepoAnalysis
router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ message: 'Invalid AI repo analysis ID' });
    return;
  }

  try {
    const updatedAnalysis = await aiRepoAnalysisService.updateAIRepoAnalysis(id, req.body);
    if (!updatedAnalysis) {
      res.status(404).json({ error: 'AI repo analysis not found.' });
      return;
    }
    res.json(updatedAnalysis);
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating AI repo analysis', error: error.message ?? error });
  }
});

// DELETE /aiRepoAnalysis/:id - Delete an AIRepoAnalysis
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ message: 'Invalid AI repo analysis ID' });
    return;
  }

  try {
    const deleted = await aiRepoAnalysisService.deleteAIRepoAnalysis(id);
    if (!deleted) {
      res.status(404).json({ error: 'AI repo analysis not found.' });
      return;
    }
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting AI repo analysis', error: error.message ?? error });
  }
});

export default router;
