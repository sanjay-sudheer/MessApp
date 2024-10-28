// routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');  // Import the admin controller
const adminAuthMiddleware = require('../middlewares/adminAuthMiddleware');  // Import the JWT middleware

// Route to mark global attendance
// POST /api/admin/mark-global-attendance
router.post('/mark-global-attendance',adminAuthMiddleware,adminController.markGlobalAttendance);  // Use JWT middleware
router.post('/monthly-report',adminAuthMiddleware,adminController.generateMonthlyReport);  // Use JWT middleware
router.post('/login',adminController.login);  

module.exports = router;
