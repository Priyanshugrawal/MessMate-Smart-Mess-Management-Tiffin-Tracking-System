const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const pool = require('../config/db');

const registerValidation = [
  body('name').trim().notEmpty(),
  body('email').isEmail(),
  body('phone').isLength({ min: 10, max: 15 }),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['admin', 'student']),
];

const loginValidation = [body('email').isEmail(), body('password').notEmpty()];

const signToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const register = async (req, res, next) => {
  try {
    const { name, email, phone, room_no, password, role, plan_type } = req.body;
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (name, email, phone, room_no, password, role, plan_type) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, email, phone, room_no || null, hashedPassword, role, plan_type || 'monthly']
    );

    const token = signToken(result.insertId, role);
    res.status(201).json({ token, user: { id: result.insertId, name, email, role } });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!rows.length) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signToken(user.id, user.role);
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        room_no: user.room_no,
      },
    });
  } catch (error) {
    next(error);
  }
};

const me = async (req, res) => {
  res.json({ user: req.user });
};

module.exports = {
  register,
  login,
  me,
  registerValidation,
  loginValidation,
};
