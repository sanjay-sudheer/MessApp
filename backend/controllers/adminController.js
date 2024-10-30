const moment = require('moment-timezone');
const Attendance = require('../models/attendanceModel');
const Inmate = require('../models/inmateModel');
const MessCut = require('../models/messCutModel');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');      // CommonJS syntax for importing dotenv

dotenv.config(); 

// Controller to mark global attendance (mess cut)
exports.markGlobalAttendance = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

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

    // Create and save the new MessCut record (Global Absence)
    const newMessCut = new MessCut({
      startDate: start.toDate(),
      endDate: end.toDate(),
    });

    await newMessCut.save();
    return res.status(201).json({ message: 'Global attendance (mess cut) marked successfully', messCut: newMessCut });
  } catch (error) {
    res.status(500).json({ message: 'Error processing global attendance', error });
  }
};

// Controller to generate the monthly report, including global absences from the MessCut model
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

    // Fetch all inmates, sorted by year and room number
    const inmates = await Inmate.find().sort({ year: 1, roomNumber: 1 });
    if (!inmates.length) {
      return res.status(404).json({ message: 'No inmates found' });
    }

    // Fetch all global mess cuts that overlap with the month
    const messCuts = await MessCut.find({
      startDate: { $lte: endDate.toDate() },
      endDate: { $gte: startDate.toDate() }
    });

    // Convert messCuts to an array of dates for easy checking
    const globalAbsentDates = new Set();
    messCuts.forEach(messCut => {
      const cutStart = moment(messCut.startDate).startOf('day');
      const cutEnd = moment(messCut.endDate).endOf('day');
      for (let date = cutStart; date.isSameOrBefore(cutEnd); date.add(1, 'days')) {
        globalAbsentDates.add(date.format('YYYY-MM-DD'));
      }
    });

    const report = [];

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
      let consecutiveAbsenceStreak = 0;
      let totalPresents = totalDaysInMonth;

      const normalAbsentDates = new Set();

      // Process each day in the month
      for (let day = 1; day <= totalDaysInMonth; day++) {
        const currentDate = startDate.clone().add(day - 1, 'days').format('YYYY-MM-DD');
        const isGlobalAbsent = globalAbsentDates.has(currentDate);
        const isNormalAbsent = attendanceRecords.some(record => moment(record.date).format('YYYY-MM-DD') === currentDate);

        if (isGlobalAbsent) {
          globalAbsences++;
          totalPresents--; // Decrement present days only once for global absence
          consecutiveAbsenceStreak++; // Increment streak for global absences
        } else if (isNormalAbsent) {
          totalPresents--; // Decrement present days only if it's a unique normal absence
          consecutiveAbsenceStreak++;
          normalAbsentDates.add(currentDate);
        } else {
          // If it's a present day, finalize any streak of absences
          if (consecutiveAbsenceStreak >= 4) {
            const actualNormalAbsenceCount = consecutiveAbsenceStreak - globalAbsences; // Calculate actual normal absence count
            normalAbsences += actualNormalAbsenceCount > 0 ? actualNormalAbsenceCount : 0; // Only add if it's above 0
            consecutiveAbsenceStreak = 0; // Reset streak on a present day
            globalAbsences = 0; // Reset global absences within the streak
          } else {
            consecutiveAbsenceStreak = 0; // Reset streak on a present day
            globalAbsences = 0; // Reset global absences within the streak
          }
        }
      }

      // Final check if the month ends on a streak
      if (consecutiveAbsenceStreak >= 4) {
        const actualNormalAbsenceCount = consecutiveAbsenceStreak - globalAbsences;
        normalAbsences += actualNormalAbsenceCount > 0 ? actualNormalAbsenceCount : 0;
      }

      // Global absences are assigned to everyone
      totalAbsences = globalAbsentDates.size + normalAbsences;

      // Recalculate totalPresents after finalizing absences
      totalPresents = totalDaysInMonth - totalAbsences;

      // Add the data to the report
      report.push({
        admissionNumber: inmate.admissionNumber,
        name: inmate.name,
        year: inmate.year,
        roomNumber: inmate.roomNumber,
        totalPresents,
        totalAbsences,
        globalAbsences: globalAbsentDates.size, // Ensure each inmate receives the global absence count
        normalAbsences,
        month: parseInt(month),
        year: parseInt(year)
      });
    }

    // Sort report by year first, then roomNumber
    report.sort((a, b) => a.year - b.year);

    return res.status(200).json({ message: 'Monthly report generated successfully', report });
  } catch (error) {
    console.error('Error generating monthly report:', error);
    res.status(500).json({ message: 'Error generating monthly report', error: error.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the credentials match environment variables
    if (username === process.env.USER_NAME && password === process.env.PASSWORD) {
      // Generate JWT token with admin flag
      const token = jwt.sign(
        { username, isAdmin: true }, // Payload includes admin claim
        process.env.JWT_SECRET,
      );

      return res.status(200).json({ message: 'Login successful', token });
    }

    return res.status(401).json({ message: 'Invalid credentials' });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};

exports.deleteWholeMonthAttendance = async (req, res) => {
  try {
    const { month } = req.body;

    // Validate month
    if (!month || month < 1 || month > 12) {
      return res.status(400).json({ message: 'Invalid month provided' });
    }

    // Delete attendance records for the specified month
    const result = await Attendance.deleteMany({ month });

    return res.status(200).json({
      message: `Attendance records for month ${month} deleted successfully.`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error('Error deleting monthly attendance:', error);
    res.status(500).json({ message: 'Error deleting attendance records for the specified month.', error: error.message });
  }
};