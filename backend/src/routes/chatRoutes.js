const express = require('express');
const { authenticate } = require('../middleware/auth');
const { listMessages, listUsers } = require('../controllers/chatController');

const router = express.Router();
router.use(authenticate);

router.get('/messages', listMessages);
router.get('/users', listUsers);

module.exports = router;
