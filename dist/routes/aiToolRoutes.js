"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const aiToolService_1 = require("../services/aiToolService");
const router = express_1.default.Router();
const aiToolService = new aiToolService_1.AiToolService();
router.get('/trending-analysis', async (req, res) => {
    try {
        const result = await aiToolService.analyzeTrendingRepositories();
        res.json(result);
    }
    catch (error) {
        console.error('Error analyzing trending repositories:', error);
        res.status(500).json({ error: error.message || 'An error occurred while analyzing trending repositories.' });
    }
});
exports.default = router;
