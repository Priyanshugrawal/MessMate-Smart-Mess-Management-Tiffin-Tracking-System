const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { listComplaints, addComplaint, updateComplaintStatus } = require('../controllers/complaintController');

const router = express.Router();
router.use(authenticate);

router.get('/', listComplaints);
router.post('/', addComplaint);
router.patch('/:id', authorize('admin'), updateComplaintStatus);

module.exports = router;
