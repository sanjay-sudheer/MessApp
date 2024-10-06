// models/attendanceModel.js

const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  inmateID: { type: mongoose.Schema.Types.ObjectId, ref: 'Inmate', required: true }, // Reference to the Inmate
  date: { type: Date, required: true },                                              // The specific date marked as Absent
  month: { type: Number, required: true }                                            // Month of the absence for quick retrieval (1-12)
});

module.exports = mongoose.model('Attendance', attendanceSchema);
