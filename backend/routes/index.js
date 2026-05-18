const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const employeeRoutes = require('./employeeRoutes');
const aiRoutes = require('./aiRoutes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/employees', employeeRoutes);
router.use('/ai', aiRoutes);

module.exports = router;
