const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { protect, authorize } = require('../utils/authMiddleware');

// Protected employee endpoints
router.get('/', protect, authorize('hr'), employeeController.getAllEmployees);
router.get('/search', protect, authorize('hr'), employeeController.searchAndFilter);
router.get('/:id', protect, employeeController.getEmployeeById);
router.post('/', protect, authorize('hr'), employeeController.addEmployee);
router.put('/:id', protect, employeeController.updateEmployee);
router.delete('/:id', protect, authorize('hr'), employeeController.deleteEmployee);

module.exports = router;
