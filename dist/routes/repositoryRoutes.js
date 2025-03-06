"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/repository.routes.ts
const express_1 = require("express");
const repositoryService_1 = require("../services/repositoryService");
const remorkReadme_1 = require("../scripts/remorkReadme");
const router = (0, express_1.Router)();
const repositoryService = new repositoryService_1.RepositoryService();
// GET /repositories - Get all repositories
router.get('/', async (req, res) => {
    try {
        const repositories = await repositoryService.getAllRepositories(req.query);
        res.json(repositories);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating repository', error: error.message ?? error });
    }
});
// GET /repositories/:id - Get a repository by ID
router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid repository ID' });
        return;
    }
    try {
        const repository = await repositoryService.getRepositoryById(id);
        if (!repository) {
            res.status(404).json({ message: 'Repository not found' });
            return;
        }
        res.json(repository);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating repository', error: error.message ?? error });
    }
});
// POST /repositories - Create a new repository
router.post('/', async (req, res) => {
    try {
        const newRepository = await repositoryService.createRepository(req.body);
        res.status(201).json(newRepository);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating repository', error: error.message ?? error });
    }
});
// PUT /repositories/:id - Update a repository
router.put('/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid repository ID' });
        return;
    }
    try {
        const updatedRepository = await repositoryService.updateRepository(id, req.body);
        if (!updatedRepository) {
            res.status(404).json({ message: 'Repository not found' });
            return;
        }
        res.json(updatedRepository);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating repository', error: error.message ?? error });
    }
});
// DELETE /repositories/:id - Delete a repository
router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid repository ID' });
        return;
    }
    try {
        const deleted = await repositoryService.deleteRepository(id);
        if (!deleted) {
            res.status(404).json({ message: 'Repository not found' });
            return;
        }
        res.json({ message: 'Repository deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating repository', error: error.message ?? error });
    }
});
router.post('/get-cleaned-readme', async (req, res) => {
    await (0, remorkReadme_1.getCleanedReadme)();
    res.status(200).json(true);
});
exports.default = router;
