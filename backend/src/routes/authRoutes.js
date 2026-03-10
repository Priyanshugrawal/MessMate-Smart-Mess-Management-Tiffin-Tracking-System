const express = require('express');
const validateRequest = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const { register, login, me, registerValidation, loginValidation } = require('../controllers/authController');

const router = express.Router();

router.post('/register', registerValidation, validateRequest, register);
router.post('/login', loginValidation, validateRequest, login);
router.get('/me', authenticate, me);

module.exports = router;
