const pool = require('../config/db');

const addSuggestion = async (req, res, next) => {
  try {
    await pool.query('INSERT INTO food_suggestions (user_id, suggestion, votes) VALUES (?, ?, ?)', [
      req.user.id,
      req.body.suggestion,
      1,
    ]);
    res.status(201).json({ message: 'Suggestion submitted' });
  } catch (error) {
    next(error);
  }
};

const listSuggestions = async (_req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT suggestion, COUNT(*) AS requests, SUM(votes) AS votes FROM food_suggestions GROUP BY suggestion ORDER BY requests DESC LIMIT 20'
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

module.exports = { addSuggestion, listSuggestions };
