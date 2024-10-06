// controllers/authController.js

const Inmate = require('../models/inmateModel');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// Login function
exports.login = async (req, res) => {
  const { admissionNumber, roomNumber } = req.body;
  console.log(req.body);

  try {
    // Find the user by admission number (username)
    const inmate = await Inmate.findOne({ admissionNumber });
    console.log(inmate);
    if (!inmate) {
      return res.status(400).json({ message: 'Invalid credentials1' });
    }

    // Compare raw room number directly (no hashing)
    if (roomNumber !== inmate.roomNumber) {
      return res.status(400).json({ message: 'Invalid credentials2' });
    }

    // Generate JWT token
    const token = jwt.sign({ admissionNumber: inmate.admissionNumber }, process.env.JWT_SECRET, {
      expiresIn: '1h'  // Token expires in 1 hour
    });

    res.status(200).json({
      message: 'Login successful',
      token,
      inmate: {
        admissionNumber: inmate.admissionNumber,
        name: inmate.name,
        department: inmate.department,
        year: inmate.year,
        batch: inmate.batch,
        roomNumber: inmate.roomNumber
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
