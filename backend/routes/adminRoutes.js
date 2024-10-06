// routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');  // Import the admin controller

// Route to mark global attendance
// POST /api/admin/mark-global-attendance
router.post('/mark-global-attendance',adminController.markGlobalAttendance);  // Use JWT middleware
router.post('/monthly-report',adminController.generateMonthlyReport);  // Use JWT middleware

module.exports = router;
