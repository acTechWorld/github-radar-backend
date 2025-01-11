"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/language.routes.ts
const express_1 = require("express");
const languageService_1 = require("../services/languageService");
const router = (0, express_1.Router)();
const languageService = new languageService_1.LanguageService();
// GET /languages - Get all languages
router.get('/', async (req, res) => {
    try {
        const languages = await languageService.getAllLanguages();
        res.json(languages);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating repository', error: error.message ?? error });
    }
});
// GET /languages/:id - Get a single language by ID
router.get('/:id', async (req, res) => {
    try {
        const language = await languageService.getLanguageById(Number(req.params.id));
        if (!language) {
            res.status(404).json({ error: 'Language not found.' });
            return;
        }
        res.json(language);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating repository', error: error.message ?? error });
    }
});
// POST /languages - Create a new language
router.post('/', async (req, res) => {
    try {
        const newLanguage = await languageService.createLanguage(req.body);
        res.status(201).json(newLanguage);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating repository', error: error.message ?? error });
    }
});
// PUT /languages/:id - Update an existing language
router.put('/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid repository ID' });
        return;
    }
    try {
        const updatedLanguage = await languageService.updateLanguage(id, req.body);
        if (!updatedLanguage) {
            res.status(404).json({ error: 'Language not found.' });
            return;
        }
        res.json(updatedLanguage);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating repository', error: error.message ?? error });
    }
});
// DELETE /languages/:id - Delete a language
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await languageService.deleteLanguage(Number(req.params.id));
        if (!deleted) {
            res.status(404).json({ error: 'Language not found.' });
            return;
        }
        res.status(204).send(); // No content
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating repository', error: error.message ?? error });
    }
});
exports.default = router;
