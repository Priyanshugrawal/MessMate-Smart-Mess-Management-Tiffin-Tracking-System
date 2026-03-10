const bcrypt = require('bcryptjs');
const pool = require('../config/db');

const listStudents = async (_req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, phone, room_no, plan_type, created_at FROM users WHERE role = 'student' ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

const createStudent = async (req, res, next) => {
  try {
    const { name, email, phone, room_no, password, plan_type } = req.body;
    const hash = await bcrypt.hash(password || 'student123', 10);

    const [result] = await pool.query(
      'INSERT INTO users (name, email, phone, room_no, password, role, plan_type) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, email, phone, room_no, hash, 'student', plan_type || 'monthly']
    );

    res.status(201).json({ id: result.insertId, message: 'Student created' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Email already exists' });
    }
    next(error);
  }
};

const removeStudent = async (req, res, next) => {
  try {
    await pool.query("DELETE FROM users WHERE id = ? AND role = 'student'", [req.params.id]);
    res.json({ message: 'Student removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = { listStudents, createStudent, removeStudent };
