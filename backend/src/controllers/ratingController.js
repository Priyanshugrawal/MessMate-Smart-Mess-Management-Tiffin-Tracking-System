const pool = require('../config/db');

const submitRating = async (req, res, next) => {
  try {
    const { meal_id, taste, quantity, quality } = req.body;
    await pool.query(
      'INSERT INTO ratings (user_id, meal_id, taste, quantity, quality) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, meal_id, taste, quantity, quality]
    );
    res.status(201).json({ message: 'Rating saved' });
  } catch (error) {
    next(error);
  }
};

const getRatingsSummary = async (_req, res, next) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT meal_id,
             ROUND(AVG(taste), 1) AS avg_taste,
             ROUND(AVG(quantity), 1) AS avg_quantity,
             ROUND(AVG(quality), 1) AS avg_quality
      FROM ratings
      GROUP BY meal_id
      ORDER BY meal_id DESC
      LIMIT 30
      `
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

module.exports = { submitRating, getRatingsSummary };
