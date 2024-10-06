// controllers/adminController.js

const moment = require('moment-timezone');
const Attendance = require('../models/attendanceModel');
const Inmate = require('../models/inmateModel');

exports.markGlobalAttendance = async (req, res) => {
  try {
    const { startDate, endDate } = req.body; // Expecting a date range

    // Ensure the incoming dates are in IST and set to midday
    const start = moment.tz(startDate, 'Asia/Kolkata').set({ hour: 12, minute: 0, second: 0, millisecond: 0 });
    const end = moment.tz(endDate, 'Asia/Kolkata').set({ hour: 12, minute: 0, second: 0, millisecond: 0 });

    if (!start.isValid() || !end.isValid()) {
      return res.status(400).json({ message: 'Invalid dates provided' });
    }

    // Check if the start date is before or the same as the end date
    if (start.isAfter(end)) {
      return res.status(400).json({ message: 'Start date must be before or the same as end date' });
    }

    // Step to find all inmates
    const inmates = await Inmate.find();

    // Mark attendance for each inmate over the date range
    for (let date = start; date.isSameOrBefore(end); date.add(1, 'days')) {
      await Promise.all(inmates.map(async (inmate) => {
        const existingRecord = await Attendance.findOne({ admissionNumber: inmate.admissionNumber, date: date.toDate() });

        if (!existingRecord) {
          const newAttendance = new Attendance({
            admissionNumber: inmate.admissionNumber,
            date: date.toDate(),  // Save the date as a Date object
            month: date.month() + 1, // month index starting from 0, so we add 1
            global: true  // Mark as global attendance
          });
          await newAttendance.save(); // Save new attendance record
        }
      }));
    }

    return res.status(200).json({ message: 'Global attendance marked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error processing global attendance', error });
  }
};

exports.generateMonthlyReport = async (req, res) => {
  try {
    const { month, year } = req.body;

    // Validate month and year
    if (!month || !year || month < 1 || month > 12 || year < 2000 || year > new Date().getFullYear()) {
      return res.status(400).json({ message: 'Invalid month or year provided' });
    }

    // Calculate the start and end dates of the month
    const startDate = moment.tz(`${year}-${month.toString().padStart(2, '0')}-01`, 'YYYY-MM-DD', 'Asia/Kolkata').startOf('month');
    const endDate = startDate.clone().endOf('month');
    const totalDaysInMonth = endDate.date();

    // Fetch all inmates
    const inmates = await Inmate.find();
    if (!inmates.length) {
      return res.status(404).json({ message: 'No inmates found' });
    }

    // Initialize report data
    const report = [];

    // Iterate through all inmates and compile attendance data
    for (const inmate of inmates) {
      const attendanceRecords = await Attendance.find({
        admissionNumber: inmate.admissionNumber,
        date: {
          $gte: startDate.toDate(),
          $lte: endDate.toDate()
        }
      }).sort('date');

      let totalAbsences = 0;
      let globalAbsences = 0;
      let normalAbsences = 0;
      let absenceStreak = 0;
      let previousDayAbsent = false;

      // Track the days attended (present)
      let totalPresents = totalDaysInMonth;

      // Loop through each day of the month to evaluate absences
      for (let day = 1; day <= totalDaysInMonth; day++) {
        const currentDate = startDate.clone().add(day - 1, 'days');
        const record = attendanceRecords.find(r => moment(r.date).isSame(currentDate, 'day'));

        if (record) {
          // This day is marked as absent in the database
          totalPresents--;  // Decrease present count
          if (record.global) {
            globalAbsences++;
            if (absenceStreak >= 4) {
              normalAbsences += absenceStreak;
            }
            absenceStreak = 0;  // Reset streak after global absence
          } else {
            // Continue the absence streak for normal absence
            absenceStreak++;
          }
        } else {
          // No record, this is a present day, finalize any ongoing streak
          if (absenceStreak >= 4) {
            normalAbsences += absenceStreak;  // Add streak to normal absences
          }
          absenceStreak = 0;  // Reset streak since it's a present day
        }
      }

      // Final check for remaining absence streak at the end of the month
      if (absenceStreak >= 4) {
        normalAbsences += absenceStreak;
      }

      totalAbsences = globalAbsences + normalAbsences;

      // Add the data to the report
      report.push({
        admissionNumber: inmate.admissionNumber,
        name: inmate.name,
        totalPresents,
        totalAbsences,
        globalAbsences,
        normalAbsences,
        month: parseInt(month),
        year: parseInt(year)
      });
    }

    return res.status(200).json({ message: 'Monthly report generated successfully', report });
  } catch (error) {
    console.error('Error generating monthly report:', error);
    res.status(500).json({ message: 'Error generating monthly report', error: error.message });
  }
};
