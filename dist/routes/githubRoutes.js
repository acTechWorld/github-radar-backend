"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const githubService_1 = require("../services/githubService");
const fetchGithubRepos_1 = require("../scripts/fetchGithubRepos");
const router = (0, express_1.Router)();
const githubService = new githubService_1.GithubService();
router.get('/', async (req, res) => {
    try {
        const repositories = await githubService.getAllRepositories(req.query);
        res.json(repositories);
    }
    catch (error) {
        res.status(500).json({ message: 'Error getting github repositories', error: error.message ?? error });
    }
});
router.get('/fetchGithubRepos', async (req, res) => {
    try {
        (0, fetchGithubRepos_1.fetchGithubRepos)(req.query.query, req.query.language);
        res.json('Script launched');
    }
    catch (error) {
        res.status(500).json({ message: 'Error starting script', error: error.message ?? error });
    }
});
exports.default = router;
