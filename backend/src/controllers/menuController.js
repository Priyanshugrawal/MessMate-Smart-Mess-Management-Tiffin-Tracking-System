const pool = require('../config/db');

const listMenus = async (_req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM meals ORDER BY date DESC LIMIT 30');
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

const getTodayMenu = async (_req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const [rows] = await pool.query('SELECT * FROM meals WHERE date = ?', [today]);
    res.json(rows[0] || null);
  } catch (error) {
    next(error);
  }
};

const upsertMenu = async (req, res, next) => {
  try {
    const { date, breakfast, lunch, dinner } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : req.body.image_url || null;

    const [exists] = await pool.query('SELECT id FROM meals WHERE date = ?', [date]);
    if (exists.length) {
      await pool.query(
        'UPDATE meals SET breakfast = ?, lunch = ?, dinner = ?, image_url = ? WHERE date = ?',
        [breakfast, lunch, dinner, image_url, date]
      );
      return res.json({ message: 'Menu updated' });
    }

    await pool.query(
      'INSERT INTO meals (date, breakfast, lunch, dinner, image_url) VALUES (?, ?, ?, ?, ?)',
      [date, breakfast, lunch, dinner, image_url]
    );
    res.status(201).json({ message: 'Menu added' });
  } catch (error) {
    next(error);
  }
};

module.exports = { listMenus, getTodayMenu, upsertMenu };
