const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { getDashboardMetrics, getAnalytics } = require('../controllers/adminController');

const router = express.Router();
router.use(authenticate, authorize('admin'));

router.get('/dashboard', getDashboardMetrics);
router.get('/analytics', getAnalytics);

module.exports = router;
