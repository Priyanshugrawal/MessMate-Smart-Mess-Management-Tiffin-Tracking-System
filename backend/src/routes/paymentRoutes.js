const express = require('express');
const { authenticate } = require('../middleware/auth');
const {
  createOrder,
  verifyPayment,
  getPaymentHistory,
} = require('../controllers/paymentController');

const router = express.Router();
router.use(authenticate);

router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);
router.get('/history', getPaymentHistory);

module.exports = router;
