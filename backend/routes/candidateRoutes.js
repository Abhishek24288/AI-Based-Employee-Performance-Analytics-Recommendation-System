const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');
const { protect, authorize } = require('../utils/authMiddleware');

// Candidate CRUD endpoints - Protected for HR role only
router.get('/', protect, authorize('hr'), candidateController.getAllCandidates);
router.post('/', protect, authorize('hr'), candidateController.addCandidate);
router.get('/:id', protect, authorize('hr'), candidateController.getCandidateById);
router.delete('/:id', protect, authorize('hr'), candidateController.deleteCandidate);

module.exports = router;
