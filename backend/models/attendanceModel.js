// models/attendanceModel.js

const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  admissionNumber: { type: String, required: true },  // Reference to the Inmate by admission number
  date: { type: Date, required: true },               // The specific date marked as Absent
  month: { type: Number, required: true }             // Month of the absence for quick retrieval (1-12)
});

module.exports = mongoose.model('Attendance', attendanceSchema);
