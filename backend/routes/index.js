const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const employeeRoutes = require('./employeeRoutes');
const aiRoutes = require('./aiRoutes');
const candidateRoutes = require('./candidateRoutes');
const matchController = require('../controllers/matchController');
const { protect, authorize } = require('../utils/authMiddleware');

// Mount routes
router.use('/auth', authRoutes);
router.use('/employees', employeeRoutes);
router.use('/ai', aiRoutes);
router.use('/candidates', candidateRoutes);
router.post('/match', protect, authorize('hr'), matchController.matchCandidates);

module.exports = router;
