const express = require('express');
const router = express.Router();
const inmateController = require('../controllers/inmateController');
const authAdminMiddleware = require('../middlewares/adminAuthMiddleware');

// Define the routes for the inmate model
router.post('/add',authAdminMiddleware, inmateController.addInmate);
router.get('/all',authAdminMiddleware, inmateController.getAllInmates);
router.get('/:admissionNumber', inmateController.getInmateByAdmissionNumber);
router.put('/:admissionNumber',authAdminMiddleware, inmateController.updateInmate);

module.exports = router;