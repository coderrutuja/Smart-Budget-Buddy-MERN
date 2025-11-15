const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getGamification } = require('../controllers/gamificationController');

const router = express.Router();

router.get('/', protect, getGamification);

module.exports = router;
