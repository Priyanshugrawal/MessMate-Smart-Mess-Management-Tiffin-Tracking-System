const dayjs = require('dayjs');
const pool = require('../config/db');
const { canSkipMeal } = require('../services/mealRules');

const getSkips = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT sm.id, sm.user_id, u.name, sm.date, sm.meal_type, sm.created_at
      FROM skip_meals sm
      JOIN users u ON u.id = sm.user_id
      ${req.user.role === 'student' ? 'WHERE sm.user_id = ?' : ''}
      ORDER BY sm.date DESC
      LIMIT 200
      `,
      req.user.role === 'student' ? [req.user.id] : []
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

const createSkip = async (req, res, next) => {
  try {
    const { skipFrom, skipTo, meal_type } = req.body;
    const userId = req.user.role === 'admin' && req.body.user_id ? req.body.user_id : req.user.id;

    const start = dayjs(skipFrom);
    const end = dayjs(skipTo || skipFrom);

    if (!start.isValid() || !end.isValid() || end.isBefore(start)) {
      return res.status(400).json({ message: 'Invalid skip range' });
    }

    const dates = [];
    let cursor = start;
    while (cursor.isBefore(end) || cursor.isSame(end, 'day')) {
      dates.push(cursor.format('YYYY-MM-DD'));
      cursor = cursor.add(1, 'day');
    }

    for (const date of dates) {
      const rule = canSkipMeal({ date, mealType: meal_type });
      if (!rule.allowed) {
        return res.status(400).json({ message: rule.reason });
      }

      await pool.query(
        'INSERT IGNORE INTO skip_meals (user_id, date, meal_type) VALUES (?, ?, ?)',
        [userId, date, meal_type]
      );
    }

    res.status(201).json({ message: 'Meal skip registered', count: dates.length });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSkips, createSkip };
