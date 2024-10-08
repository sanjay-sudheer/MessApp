const moment = require('moment-timezone');
const Attendance = require('../models/attendanceModel');
const Inmate = require('../models/inmateModel');
const MessCut = require('../models/messCutModel');

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

    // Fetch all inmates
    const inmates = await Inmate.find();
    if (!inmates.length) {
      return res.status(404).json({ message: 'No inmates found' });
    }

    // Fetch all mess cuts that overlap with the current month
    const messCuts = await MessCut.find({
      startDate: { $lte: endDate.toDate() },
      endDate: { $gte: startDate.toDate() }
    });

    // Convert messCuts into an array of dates for easy checking
    const globalAbsentDates = [];
    messCuts.forEach(messCut => {
      const cutStart = moment(messCut.startDate).startOf('day');
      const cutEnd = moment(messCut.endDate).endOf('day');
      for (let date = cutStart; date.isSameOrBefore(cutEnd); date.add(1, 'days')) {
        globalAbsentDates.push(date.format('YYYY-MM-DD'));
      }
    });

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
      let consecutiveAbsenceDates = [];  // To store consecutive absence dates

      // Track the days attended (present)
      let totalPresents = totalDaysInMonth;

      // Loop through each day of the month to evaluate absences
      for (let day = 1; day <= totalDaysInMonth; day++) {
        const currentDate = startDate.clone().add(day - 1, 'days').format('YYYY-MM-DD'); // Convert to string for comparison
        const record = attendanceRecords.find(r => moment(r.date).format('YYYY-MM-DD') === currentDate);

        // Check if the current date is in the global absent dates array (from MessCut)
        if (globalAbsentDates.includes(currentDate)) {
          globalAbsences++;
          totalPresents--;  // Decrease present count

          // Treat global absences as part of the normal absence streak
          if (consecutiveAbsenceDates.length > 0) {
            consecutiveAbsenceDates.push(currentDate);
          }
        } else if (record) {
          // This day is marked as a normal absence in the database
          totalPresents--;  // Decrease present count
          consecutiveAbsenceDates.push(currentDate);  // Track consecutive absences
          console.log(`Normal absence recorded for ${inmate.admissionNumber} on ${currentDate}`);
        } else {
          // Present day: finalize any streak of absences
          if (consecutiveAbsenceDates.length >= 4) {
            normalAbsences += consecutiveAbsenceDates.length;  // Count the entire streak of absences
            console.log(`Normal absence streak for ${inmate.admissionNumber}: ${consecutiveAbsenceDates.length} days`);
          }
          consecutiveAbsenceDates = [];  // Reset streak
        }
      }

      // Final check for remaining streak of absences at the end of the month
      if (consecutiveAbsenceDates.length >= 4) {
        normalAbsences += consecutiveAbsenceDates.length;
        console.log(`End of month streak for ${inmate.admissionNumber}: ${consecutiveAbsenceDates.length} days`);
      }

      totalAbsences = globalAbsences + normalAbsences;

      // Calculate total presents: totalDaysInMonth - totalAbsences
      totalPresents = totalDaysInMonth - totalAbsences;

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


