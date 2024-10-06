// routes/attendanceRoutes.js

const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');  // Import the attendance controller
const authMiddleware = require('../middlewares/authMiddleware');  // Import the JWT middleware

// Route to mark attendance by date range
// POST /api/attendance/mark
router.post('/mark', authMiddleware, attendanceController.markAttendanceByDateRange);  // Use JWT middleware

module.exports = router;
