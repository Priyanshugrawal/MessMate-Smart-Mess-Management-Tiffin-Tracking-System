const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : '*',
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        return next(new Error('Unauthorized'));
      }
      const user = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = user;
      return next();
    } catch (error) {
      return next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    // Join general room by default
    socket.join('general');
    console.log(`User ${socket.user.id} connected`);

    // Join private chat room
    socket.on('joinPrivate', ({ receiverId }) => {
      const room = [socket.user.id, receiverId].sort((a, b) => a - b).join('_');
      socket.join(`private_${room}`);
      console.log(`User ${socket.user.id} joined private room: private_${room}`);
    });

    // Handle general and private chat messages
    socket.on('chatMessage', async ({ message, chat_type = 'general', receiver_id = null }) => {
      if (!message?.trim()) return;

      try {
        // Insert message into database
        await pool.query(
          'INSERT INTO chat_messages (sender_id, receiver_id, message, chat_type, room) VALUES (?, ?, ?, ?, ?)',
          [socket.user.id, receiver_id, message, chat_type, chat_type === 'general' ? 'general' : `private_${[socket.user.id, receiver_id].sort((a,b)=>a-b).join('_')}`]
        );

        const messageData = {
          sender_id: socket.user.id,
          receiver_id,
          message,
          chat_type,
          timestamp: new Date().toISOString(),
        };

        // Emit to appropriate room
        if (chat_type === 'private' && receiver_id) {
          const room = [socket.user.id, receiver_id].sort((a, b) => a - b).join('_');
          io.to(`private_${room}`).emit('chatMessage', messageData);
        } else {
          io.to('general').emit('chatMessage', messageData);
        }
      } catch (error) {
        console.error('Chat message error:', error);
      }
    });

    // Handle delivery location updates
    socket.on('deliveryLocation', async (payload) => {
      const { delivery_person_id, latitude, longitude, status, meal_type } = payload;
      const today = new Date().toISOString().split('T')[0];
      
      try {
        await pool.query(
          'INSERT INTO delivery_tracking (delivery_person_id, latitude, longitude, status, meal_type, delivery_date) VALUES (?, ?, ?, ?, ?, ?)',
          [delivery_person_id, latitude, longitude, status || 'on_the_way', meal_type, today]
        );
        
        // Broadcast to all connected clients
        io.emit('deliveryUpdate', {
          delivery_person_id,
          latitude,
          longitude,
          status,
          meal_type,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error('Delivery location error:', error);
      }
    });

    // Handle delivery status changes
    socket.on('deliveryStatusChange', async ({ status, meal_type }) => {
      try {
        const today = new Date().toISOString().split('T')[0];
        
        // Broadcast status change to all clients
        io.emit('deliveryStatusUpdate', {
          status,
          meal_type,
          date: today,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error('Delivery status change error:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`User ${socket.user.id} disconnected`);
    });
  });
};
