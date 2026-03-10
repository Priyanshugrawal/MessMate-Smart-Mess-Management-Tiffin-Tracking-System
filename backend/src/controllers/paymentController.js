const Razorpay = require('razorpay');
const crypto = require('crypto');
const pool = require('../config/db');

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Create Razorpay order
 */
const createOrder = async (req, res, next) => {
  try {
    const { amount, description } = req.body;
    const userId = req.user.id;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        user_id: userId,
        description: description || 'Mess Fee Payment',
      },
    };

    const order = await razorpay.orders.create(options);

    res.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    next(error);
  }
};

/**
 * Verify Razorpay payment signature
 */
const verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      description,
    } = req.body;

    const userId = req.user.id;

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    // Save transaction to database
    await pool.query(
      `INSERT INTO transactions 
       (user_id, amount, type, status, description, payment_method, razorpay_order_id, razorpay_payment_id, razorpay_signature) 
       VALUES (?, ?, 'credit', 'completed', ?, 'razorpay', ?, ?, ?)`,
      [userId, amount / 100, description || 'Mess Fee Payment', razorpay_order_id, razorpay_payment_id, razorpay_signature]
    );

    res.json({
      success: true,
      message: 'Payment verified and saved successfully',
      payment_id: razorpay_payment_id,
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    next(error);
  }
};

/**
 * Get payment history for logged-in user
 */
const getPaymentHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const [payments] = await pool.query(
      `SELECT id, amount, type, status, description, payment_method, 
              razorpay_payment_id, created_at
       FROM transactions
       WHERE user_id = ? AND payment_method = 'razorpay'
       ORDER BY created_at DESC`,
      [userId]
    );
    
    res.json(payments);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getPaymentHistory,
};
