const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { listTransactions, addTransaction, refundSkippedMeals } = require('../controllers/transactionController');

const router = express.Router();

router.get('/', authenticate, listTransactions);
router.post('/', authenticate, authorize('admin'), addTransaction);
router.post('/refund', authenticate, authorize('admin'), refundSkippedMeals);

module.exports = router;
