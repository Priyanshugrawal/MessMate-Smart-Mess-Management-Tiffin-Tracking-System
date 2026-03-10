const pool = require('../config/db');

const listMessages = async (req, res, next) => {
  try {
    const { room, chat_type, receiver_id } = req.query;
    const userId = req.user.id;
    
    let query;
    let params;
    
    if (chat_type === 'private' && receiver_id) {
      // Get private messages between two users
      query = `
        SELECT cm.id, cm.sender_id, u.name AS sender_name, 
               cm.receiver_id, cm.message, cm.timestamp, cm.chat_type
        FROM chat_messages cm
        JOIN users u ON u.id = cm.sender_id
        WHERE cm.chat_type = 'private' 
          AND ((cm.sender_id = ? AND cm.receiver_id = ?) 
               OR (cm.sender_id = ? AND cm.receiver_id = ?))
        ORDER BY cm.timestamp DESC
        LIMIT 100
      `;
      params = [userId, receiver_id, receiver_id, userId];
    } else {
      // Get general group chat messages
      query = `
        SELECT cm.id, cm.sender_id, u.name AS sender_name, 
               cm.message, cm.timestamp, cm.chat_type
        FROM chat_messages cm
        JOIN users u ON u.id = cm.sender_id
        WHERE cm.chat_type = 'general'
        ORDER BY cm.timestamp DESC
        LIMIT 100
      `;
      params = [];
    }
    
    const [rows] = await pool.query(query, params);
    res.json(rows.reverse());
  } catch (error) {
    next(error);
  }
};

const listUsers = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const [users] = await pool.query(
      `SELECT id, name, email, role FROM users WHERE id != ? ORDER BY name`,
      [userId]
    );
    res.json(users);
  } catch (error) {
    next(error);
  }
};

module.exports = { listMessages, listUsers };
