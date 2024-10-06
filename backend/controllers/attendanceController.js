// controllers/attendanceController.js

const moment = require('moment-timezone');  // To handle date manipulations with time zone
const Attendance = require('../models/attendanceModel');  // Import the Attendance model

exports.markAttendanceByDateRange = async (req, res) => {
  try {
    const { inmateID, startDate, endDate } = req.body;

    // Get the current date in IST (Indian Standard Time, UTC+5:30)
    const currentDate = moment().tz('Asia/Kolkata').startOf('day');  // Current date at midnight in IST

    // Step 1: Ensure the dates are valid
    const start = moment(startDate).tz('Asia/Kolkata').startOf('day');
    const end = moment(endDate).tz('Asia/Kolkata').startOf('day');
    
    if (!start.isValid() || !end.isValid()) {
      return res.status(400).json({ message: 'Invalid dates provided' });
    }

    // Step 2: Check if the start date is at least one day ahead of the current date
    if (start.isSameOrBefore(currentDate)) {
      return res.status(400).json({ message: 'Start date must be at least one day ahead of the current date' });
    }

    // Step 3: Mark attendance as Absent for each date in the range
    for (let date = start; date.isSameOrBefore(end); date.add(1, 'days')) {
      let existingRecord = await Attendance.findOne({ inmateID, date: date.toDate() });

      if (!existingRecord) {
        // Create a new absence record if it doesn't exist
        const newAttendance = new Attendance({
          inmateID,
          date: date.toDate(),
          month: date.month() + 1  // moment.js returns month index starting from 0, so we add 1
        });
        await newAttendance.save();
      }
    }

    return res.status(200).json({ message: 'Attendance marked as absent for the provided range' });
  } catch (error) {
    res.status(500).json({ message: 'Error processing attendance', error });
  }
};
