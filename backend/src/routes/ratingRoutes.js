const express = require('express');
const { authenticate } = require('../middleware/auth');
const { submitRating, getRatingsSummary } = require('../controllers/ratingController');

const router = express.Router();
router.use(authenticate);

router.get('/', getRatingsSummary);
router.post('/', submitRating);

module.exports = router;
