const express = require('express');
const router = express.Router();
const inmateController = require('../controllers/inmateController');

// Define the routes for the inmate model
router.post('/add', inmateController.addInmate);
router.get('/all', inmateController.getAllInmates);
router.get('/:admissionNumber', inmateController.getInmateByAdmissionNumber);
router.put('/:admissionNumber', inmateController.updateInmate);

module.exports = router;