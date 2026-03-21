const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');

// GET /api/attendance?employeeId=&date=
const getAttendance = async (req, res, next) => {
  try {
    const { employeeId, date } = req.query;
    const filter = {};

    if (employeeId) filter.employee = employeeId;
    if (date) filter.date = date;

    const records = await Attendance.find(filter)
      .populate('employee', 'employeeId fullName department email')
      .sort({ date: -1 });

    // Compute totalPresent per employee if filtering by employee
    let totalPresent = null;
    if (employeeId) {
      totalPresent = await Attendance.countDocuments({ employee: employeeId, status: 'Present' });
    }

    res.json({ success: true, count: records.length, data: records, totalPresent });
  } catch (err) {
    next(err);
  }
};

// POST /api/attendance
const markAttendance = async (req, res, next) => {
  try {
    const { employeeId, date, status } = req.body;

    if (!employeeId || !date || !status) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: employeeId, date, status',
      });
    }

    // Validate employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    // Validate date format YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({ success: false, message: 'Date must be in YYYY-MM-DD format' });
    }

    // Upsert: update if exists, create if not
    const record = await Attendance.findOneAndUpdate(
      { employee: employeeId, date },
      { status },
      { new: true, upsert: true, runValidators: true }
    ).populate('employee', 'employeeId fullName department email');

    res.status(201).json({ success: true, data: record });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    next(err);
  }
};

// GET /api/attendance/summary — dashboard counts
const getSummary = async (req, res, next) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    const today = new Date().toISOString().split('T')[0];
    const presentToday = await Attendance.countDocuments({ date: today, status: 'Present' });
    const absentToday = await Attendance.countDocuments({ date: today, status: 'Absent' });

    // Per-employee total present days
    const perEmployee = await Attendance.aggregate([
      { $match: { status: 'Present' } },
      { $group: { _id: '$employee', totalPresent: { $sum: 1 } } },
      {
        $lookup: {
          from: 'employees',
          localField: '_id',
          foreignField: '_id',
          as: 'employee',
        },
      },
      { $unwind: '$employee' },
      {
        $project: {
          _id: 0,
          employeeId: '$employee.employeeId',
          fullName: '$employee.fullName',
          department: '$employee.department',
          totalPresent: 1,
        },
      },
      { $sort: { totalPresent: -1 } },
    ]);

    res.json({
      success: true,
      data: { totalEmployees, presentToday, absentToday, perEmployee },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAttendance, markAttendance, getSummary };
