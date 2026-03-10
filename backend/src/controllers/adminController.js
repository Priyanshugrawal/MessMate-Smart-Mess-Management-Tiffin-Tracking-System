const pool = require('../config/db');

const getDashboardMetrics = async (_req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const [[students]] = await pool.query("SELECT COUNT(*) AS total_students FROM users WHERE role = 'student'");
    const [[skips]] = await pool.query('SELECT COUNT(*) AS skipped_meals FROM skip_meals WHERE date = ?', [today]);
    const [[revenue]] = await pool.query(
      "SELECT COALESCE(SUM(amount), 0) AS total_revenue FROM transactions WHERE status = 'paid'"
    );

    const mealsPrepared = Math.max(0, students.total_students - skips.skipped_meals);

    res.json({
      totalStudents: students.total_students,
      skippedMeals: skips.skipped_meals,
      mealsPrepared,
      totalRevenue: Number(revenue.total_revenue),
    });
  } catch (error) {
    next(error);
  }
};

const getAnalytics = async (_req, res, next) => {
  try {
    const [demandStats] = await pool.query(
      `
      SELECT date, meal_type, COUNT(*) AS skipped
      FROM skip_meals
      GROUP BY date, meal_type
      ORDER BY date DESC
      LIMIT 30
      `
    );

    const [revenueStats] = await pool.query(
      `
      SELECT DATE_FORMAT(date, '%Y-%m') AS month, SUM(amount) AS amount
      FROM transactions
      WHERE status = 'paid'
      GROUP BY month
      ORDER BY month ASC
      `
    );

    res.json({ demandStats, revenueStats });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardMetrics, getAnalytics };
