const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { exportIncomeToSheet, exportExpenseToSheet } = require('../controllers/sheetsController');

const router = express.Router();

router.post('/export/income', protect, exportIncomeToSheet);
router.post('/export/expense', protect, exportExpenseToSheet);

module.exports = router;
