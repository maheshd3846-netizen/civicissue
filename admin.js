const express = require('express');
const { getDashboardStats, getDepartmentMetrics } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Admin routes - protect and authorize admin users only
router.use(protect);
router.use(authorize('admin', 'department_staff'));

router.get('/dashboard', getDashboardStats);
router.get('/department-metrics', getDepartmentMetrics);

module.exports = router;