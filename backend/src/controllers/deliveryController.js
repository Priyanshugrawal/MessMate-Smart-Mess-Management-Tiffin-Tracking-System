const pool = require('../config/db');

const getLatestDelivery = async (_req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT dt.*, u.name as delivery_person_name 
       FROM delivery_tracking dt
       LEFT JOIN users u ON dt.delivery_person_id = u.id
       ORDER BY dt.updated_at DESC LIMIT 1`
    );
    res.json(rows[0] || null);
  } catch (error) {
    next(error);
  }
};

const getTodayList = async (req, res, next) => {
  try {
    const { meal_type } = req.query;
    const today = new Date().toISOString().split('T')[0];
    
    if (!meal_type || !['breakfast', 'lunch', 'dinner'].includes(meal_type)) {
      return res.status(400).json({ error: 'Valid meal_type required (breakfast/lunch/dinner)' });
    }
    
    // Get all students who haven't skipped today's meal
    const [students] = await pool.query(
      `SELECT 
        u.id,
        u.name,
        u.email,
        u.room_no,
        u.phone,
        ? as meal_type,
        COALESCE(dt.status, 'pending') as delivery_status
      FROM users u
      LEFT JOIN skip_meals sm ON u.id = sm.user_id 
        AND sm.date = ? 
        AND sm.meal_type = ?
      LEFT JOIN delivery_tracking dt ON u.id = dt.delivery_person_id
        AND dt.delivery_date = ?
        AND dt.meal_type = ?
      WHERE u.role = 'student' 
        AND sm.id IS NULL
      ORDER BY u.room_no`,
      [meal_type, today, meal_type, today, meal_type]
    );
    
    res.json({
      date: today,
      meal_type,
      total_deliveries: students.length,
      students
    });
  } catch (error) {
    next(error);
  }
};

const updateDelivery = async (req, res, next) => {
  try {
    const { delivery_person_id, latitude, longitude, status, meal_type } = req.body;
    const today = new Date().toISOString().split('T')[0];
    
    await pool.query(
      `INSERT INTO delivery_tracking 
       (delivery_person_id, latitude, longitude, status, meal_type, delivery_date) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [delivery_person_id, latitude, longitude, status || 'assigned', meal_type, today]
    );
    
    res.status(201).json({ message: 'Delivery update saved' });
  } catch (error) {
    next(error);
  }
};

const updateDeliveryStatus = async (req, res, next) => {
  try {
    const { status, latitude, longitude } = req.body;
    const today = new Date().toISOString().split('T')[0];
    
    await pool.query(
      `UPDATE delivery_tracking 
       SET status = ?, latitude = ?, longitude = ?, updated_at = CURRENT_TIMESTAMP
       WHERE delivery_date = ?
       ORDER BY updated_at DESC LIMIT 1`,
      [status, latitude, longitude, today]
    );
    
    res.json({ message: 'Delivery status updated' });
  } catch (error) {
    next(error);
  }
};

module.exports = { 
  getLatestDelivery, 
  getTodayList, 
  updateDelivery,
  updateDeliveryStatus 
};
