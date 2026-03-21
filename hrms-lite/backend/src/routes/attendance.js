const express = require('express');
const router = express.Router();
const { getAttendance, markAttendance, getSummary } = require('../controllers/attendanceController');

router.get('/summary', getSummary);
router.get('/', getAttendance);
router.post('/', markAttendance);

module.exports = router;
