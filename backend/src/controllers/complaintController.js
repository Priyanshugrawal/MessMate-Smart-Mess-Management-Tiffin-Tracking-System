const pool = require('../config/db');

const listComplaints = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT c.*, u.name
      FROM complaints c
      JOIN users u ON u.id = c.user_id
      ${req.user.role === 'student' ? 'WHERE c.user_id = ?' : ''}
      ORDER BY c.created_at DESC
      `,
      req.user.role === 'student' ? [req.user.id] : []
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

const addComplaint = async (req, res, next) => {
  try {
    await pool.query('INSERT INTO complaints (user_id, message, status) VALUES (?, ?, ?)', [
      req.user.id,
      req.body.message,
      'open',
    ]);
    res.status(201).json({ message: 'Complaint submitted' });
  } catch (error) {
    next(error);
  }
};

const updateComplaintStatus = async (req, res, next) => {
  try {
    await pool.query('UPDATE complaints SET status = ? WHERE id = ?', [req.body.status, req.params.id]);
    res.json({ message: 'Complaint updated' });
  } catch (error) {
    next(error);
  }
};

module.exports = { listComplaints, addComplaint, updateComplaintStatus };
