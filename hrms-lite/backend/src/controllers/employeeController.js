const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');

// GET /api/employees
const getAllEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json({ success: true, count: employees.length, data: employees });
  } catch (err) {
    next(err);
  }
};

// POST /api/employees
const createEmployee = async (req, res, next) => {
  try {
    const { employeeId, fullName, email, department } = req.body;

    // Required fields check
    if (!employeeId || !fullName || !email || !department) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: employeeId, fullName, email, department',
      });
    }

    const employee = await Employee.create({ employeeId, fullName, email, department });
    res.status(201).json({ success: true, data: employee });
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      const fieldLabel = field === 'employeeId' ? 'Employee ID' : 'Email address';
      return res.status(409).json({
        success: false,
        message: `${fieldLabel} already exists`,
      });
    }
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    next(err);
  }
};

// DELETE /api/employees/:id
const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    await Employee.findByIdAndDelete(req.params.id);
    // Also delete related attendance records
    await Attendance.deleteMany({ employee: req.params.id });
    res.json({ success: true, message: 'Employee deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllEmployees, createEmployee, deleteEmployee };
