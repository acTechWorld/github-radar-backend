"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AIContentService_1 = require("../services/AIContentService");
const router = (0, express_1.Router)();
const aiContentService = new AIContentService_1.AIContentService();
// GET /ai-content - Get all AIContent
router.get('/', async (req, res) => {
    try {
        const contents = await aiContentService.getAllAIContents();
        res.json(contents);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching AI content', error: error.message ?? error });
    }
});
// GET /ai-content/:id - Get AIContent by ID
router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid AI content ID' });
        return;
    }
    try {
        const content = await aiContentService.getAIContentById(id);
        if (!content) {
            res.status(404).json({ error: 'AI content not found.' });
            return;
        }
        res.json(content);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching AI content', error: error.message ?? error });
    }
});
// POST /ai-content - Create a new AIContent
router.post('/', async (req, res) => {
    try {
        const newContent = await aiContentService.createAIContent(req.body);
        res.status(201).json(newContent);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating AI content', error: error.message ?? error });
    }
});
// PUT /ai-content/:id - Update an existing AIContent
router.put('/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid AI content ID' });
        return;
    }
    try {
        const updatedContent = await aiContentService.updateAIContent(id, req.body);
        if (!updatedContent) {
            res.status(404).json({ error: 'AI content not found.' });
            return;
        }
        res.json(updatedContent);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating AI content', error: error.message ?? error });
    }
});
// DELETE /ai-content/:id - Delete an AIContent
router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid AI content ID' });
        return;
    }
    try {
        const deleted = await aiContentService.deleteAIContent(id);
        if (!deleted) {
            res.status(404).json({ error: 'AI content not found.' });
            return;
        }
        res.status(204).send(); // No content response
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting AI content', error: error.message ?? error });
    }
});
exports.default = router;
