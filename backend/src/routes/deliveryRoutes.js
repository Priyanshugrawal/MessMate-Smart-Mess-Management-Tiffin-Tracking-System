const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { 
  getLatestDelivery, 
  getTodayList, 
  updateDelivery,
  updateDeliveryStatus 
} = require('../controllers/deliveryController');

const router = express.Router();
router.use(authenticate);

router.get('/latest', getLatestDelivery);
router.get('/today', authorize('admin'), getTodayList);
router.post('/update', authorize('admin'), updateDelivery);
router.patch('/status', authorize('admin'), updateDeliveryStatus);

module.exports = router;
