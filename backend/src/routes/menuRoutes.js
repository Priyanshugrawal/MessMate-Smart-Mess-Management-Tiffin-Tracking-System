const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { listMenus, getTodayMenu, upsertMenu } = require('../controllers/menuController');

const router = express.Router();

router.get('/', authenticate, listMenus);
router.get('/today', authenticate, getTodayMenu);
router.post('/', authenticate, authorize('admin'), upload.single('image'), upsertMenu);

module.exports = router;
