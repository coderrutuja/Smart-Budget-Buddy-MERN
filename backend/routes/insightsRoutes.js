const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getCategorySummary, getMonthlyTrend, getInsights } = require('../controllers/insightsController');

const router = express.Router();

router.get('/category-summary', protect, getCategorySummary);
router.get('/monthly-trend', protect, getMonthlyTrend);
router.get('/tips', protect, getInsights);

module.exports = router;
