// controllers/attendanceController.js

const moment = require('moment-timezone');
const Attendance = require('../models/attendanceModel');

exports.markAttendanceByDateRange = async (req, res) => {
  try {
    const { admissionNumber, startDate, endDate } = req.body;

    // Get the current date in IST (Indian Standard Time, UTC+5:30)
    const currentDate = moment().tz('Asia/Kolkata').startOf('day');  // Current date at midnight in IST

    // Step 1: Parse incoming dates (assuming they are already in IST)
    const start = moment.tz(startDate, 'Asia/Kolkata').set({ hour: 12, minute: 0, second: 0, millisecond: 0 }); // Set to midday in IST
    const end = moment.tz(endDate, 'Asia/Kolkata').set({ hour: 12, minute: 0, second: 0, millisecond: 0 });     // Set to midday in IST

    if (!start.isValid() || !end.isValid()) {
      return res.status(400).json({ message: 'Invalid dates provided' });
    }

    // Step 2: Ensure that the start date is strictly after today (can't mark for today)
    if (start.isSame(currentDate, 'day')) {
      return res.status(400).json({ message: 'Attendance cannot be marked for today' });
    }

    // Step 3: Ensure that the end date is also strictly after today
    if (end.isSame(currentDate, 'day')) {
      return res.status(400).json({ message: 'Attendance cannot be marked for today' });
    }

    // Ensure that both start and end dates are in the future
    if (start.isBefore(currentDate) || end.isBefore(currentDate)) {
      return res.status(400).json({ message: 'Attendance cannot be marked for today or past dates' });
    }

    // Step 4: Mark attendance as Absent for each date in the range
    for (let date = start; date.isSameOrBefore(end); date.add(1, 'days')) {
      let existingRecord = await Attendance.findOne({ admissionNumber, date: date.toDate() });

      if (!existingRecord) {
        // Create a new absence record if it doesn't exist
        const newAttendance = new Attendance({
          admissionNumber,
          date: date.toDate(),  // Save the date as a Date object
          month: date.month() + 1 // month index starting from 0, so we add 1
        });
        await newAttendance.save();
      }
    }

    return res.status(200).json({ message: 'Attendance marked as absent for the provided range' });
  } catch (error) {
    res.status(500).json({ message: 'Error processing attendance', error });
  }
};
