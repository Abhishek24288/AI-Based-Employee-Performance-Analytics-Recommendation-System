const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { protect, authorize } = require('../utils/authMiddleware');

// Protected AI endpoints
router.post('/recommend', protect, authorize('hr'), aiController.getAIRecommendation);
router.post('/chat', protect, aiController.chatCopilot);

module.exports = router;
