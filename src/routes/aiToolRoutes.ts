import express, { Request, Response } from 'express';
import { AiToolService } from '../services/aiToolService';

const router = express.Router();
const aiToolService = new AiToolService();

router.get('/trending-analysis', async (req: Request, res: Response) => {
  try {
    const result = await aiToolService.analyzeTrendingRepositories();
    res.json(result);
  } catch (error: any) {
    console.error('Error analyzing trending repositories:', error);
    res.status(500).json({ error: error.message || 'An error occurred while analyzing trending repositories.' });
  }
});

export default router;
