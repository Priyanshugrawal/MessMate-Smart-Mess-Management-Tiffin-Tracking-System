const pool = require('../config/db');

const listTransactions = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT t.*, u.name
      FROM transactions t
      JOIN users u ON u.id = t.user_id
      ${req.user.role === 'student' ? 'WHERE t.user_id = ?' : ''}
      ORDER BY t.date DESC
      `,
      req.user.role === 'student' ? [req.user.id] : []
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

const addTransaction = async (req, res, next) => {
  try {
    const { user_id, amount, status } = req.body;
    await pool.query('INSERT INTO transactions (user_id, amount, status, date) VALUES (?, ?, ?, NOW())', [
      user_id,
      amount,
      status || 'paid',
    ]);
    res.status(201).json({ message: 'Transaction created' });
  } catch (error) {
    next(error);
  }
};

const refundSkippedMeals = async (req, res, next) => {
  try {
    const { user_id, month, refund_amount } = req.body;
    await pool.query(
      'INSERT INTO transactions (user_id, amount, status, date, notes) VALUES (?, ?, ?, NOW(), ?)',
      [user_id, -Math.abs(refund_amount), 'refund', `Refund for skipped meals: ${month}`]
    );
    res.status(201).json({ message: 'Refund processed' });
  } catch (error) {
    next(error);
  }
};

module.exports = { listTransactions, addTransaction, refundSkippedMeals };
