const express = require('express');
const { authenticate } = require('../middleware/auth');
const { getSkips, createSkip } = require('../controllers/skipMealController');

const router = express.Router();
router.use(authenticate);

router.get('/', getSkips);
router.post('/', createSkip);

module.exports = router;
