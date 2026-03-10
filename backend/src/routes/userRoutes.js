const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { listStudents, createStudent, removeStudent } = require('../controllers/userController');

const router = express.Router();
router.use(authenticate, authorize('admin'));

router.get('/students', listStudents);
router.post('/students', createStudent);
router.delete('/students/:id', removeStudent);

module.exports = router;
