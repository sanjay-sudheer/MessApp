// controllers/inmateController.js

const Inmate = require('../models/inmateModel');  // Import the Inmate model

// Add a new inmate
exports.addInmate = async (req, res) => {
  try {
    const { admissionNumber, roomNumber, name, department, year, batch } = req.body;

    // Check if the inmate already exists
    let existingInmate = await Inmate.findOne({ admissionNumber });
    if (existingInmate) {
      return res.status(400).json({ message: 'Inmate with this admission number already exists' });
    }

    // Create a new inmate
    const newInmate = new Inmate({
      admissionNumber,
      roomNumber,
      name,
      department,
      year,
      batch
    });

    await newInmate.save();
    res.status(200).json({ message: 'Inmate added successfully', inmate: newInmate });
  } catch (error) {
    res.status(500).json({ message: 'Error adding inmate', error });
  }
};

// Get all inmates
exports.getAllInmates = async (req, res) => {
  try {
    const inmates = await Inmate.find();
    res.status(200).json(inmates);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inmates', error });
  }
};

// Get a single inmate by admission number
exports.getInmateByAdmissionNumber = async (req, res) => {
  try {
    const { admissionNumber } = req.params;
    const inmate = await Inmate.findOne({ admissionNumber });

    if (!inmate) {
      return res.status(404).json({ message: 'Inmate not found' });
    }

    res.status(200).json(inmate);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inmate', error });
  }
};

// Update inmate details
exports.updateInmate = async (req, res) => {
  try {
    const { admissionNumber } = req.params;
    const { roomNumber, name, department, year, batch } = req.body;

    // Find the inmate by admission number
    let inmate = await Inmate.findOne({ admissionNumber });

    if (!inmate) {
      return res.status(404).json({ message: 'Inmate not found' });
    }

    // Update inmate details
    inmate.roomNumber = roomNumber || inmate.roomNumber;
    inmate.name = name || inmate.name;
    inmate.department = department || inmate.department;
    inmate.year = year || inmate.year;
    inmate.batch = batch || inmate.batch;

    await inmate.save();
    res.status(200).json({ message: 'Inmate details updated successfully', inmate });
  } catch (error) {
    res.status(500).json({ message: 'Error updating inmate details', error });
  }
};

// Delete an inmate
exports.deleteInmate = async (req, res) => {
  try {
    const { admissionNumber } = req.params;

    const deletedInmate = await Inmate.findOneAndDelete({ admissionNumber });

    if (!deletedInmate) {
      return res.status(404).json({ message: 'Inmate not found' });
    }

    res.status(200).json({ message: 'Inmate deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting inmate', error });
  }
};
