const express = require('express');

const authRoutes = require('./authRoutes');
const adminRoutes = require('./adminRoutes');
const menuRoutes = require('./menuRoutes');
const userRoutes = require('./userRoutes');
const skipMealRoutes = require('./skipMealRoutes');
const transactionRoutes = require('./transactionRoutes');
const complaintRoutes = require('./complaintRoutes');
const suggestionRoutes = require('./suggestionRoutes');
const ratingRoutes = require('./ratingRoutes');
const deliveryRoutes = require('./deliveryRoutes');
const chatRoutes = require('./chatRoutes');
const paymentRoutes = require('./paymentRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/menu', menuRoutes);
router.use('/users', userRoutes);
router.use('/skip-meals', skipMealRoutes);
router.use('/transactions', transactionRoutes);
router.use('/complaints', complaintRoutes);
router.use('/suggestions', suggestionRoutes);
router.use('/ratings', ratingRoutes);
router.use('/delivery', deliveryRoutes);
router.use('/chat', chatRoutes);
router.use('/payments', paymentRoutes);

module.exports = router;
