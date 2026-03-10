const express = require('express');
const { authenticate } = require('../middleware/auth');
const { addSuggestion, listSuggestions } = require('../controllers/suggestionController');

const router = express.Router();
router.use(authenticate);

router.get('/', listSuggestions);
router.post('/', addSuggestion);

module.exports = router;
