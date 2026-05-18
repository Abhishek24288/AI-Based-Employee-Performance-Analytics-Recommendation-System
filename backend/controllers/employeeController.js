const Employee = require('../models/Employee');
const User = require('../models/User');

// @desc    Add a new employee (HR only)
// @route   POST /api/employees
// @access  Private/HR
exports.addEmployee = async (req, res) => {
  try {
    const {
      employeeId,
      name,
      email,
      department,
      skills,
      performanceScore,
      experience,
      projects,
      aiFeedback,
      trainingSuggestions
    } = req.body;

    if (!employeeId || !name || !email || !department) {
      return res.status(400).json({ error: 'Please provide employeeId, name, email, and department.' });
    }

    const emailLower = email.toLowerCase();

    // Check if employee already exists
    const employeeExists = await Employee.findOne({ email: emailLower });
    if (employeeExists) {
      return res.status(400).json({ error: 'Employee with this email address already exists.' });
    }

    // Create employee record
    const employee = new Employee({
      employeeId,
      name,
      email: emailLower,
      department,
      skills: skills || [],
      performanceScore: Number(performanceScore) || 75,
      experience: Number(experience) || 0,
      projects: projects || [],
      aiFeedback: aiFeedback || '',
      trainingSuggestions: trainingSuggestions || '',
      ranking: 0
    });

    const savedEmployee = await employee.save();

    // Automatically provision user login credentials for the employee if not already present
    const userExists = await User.findOne({ email: emailLower });
    if (!userExists) {
      const defaultPassword = 'Password123'; // Standard default password
      const user = new User({
        name,
        email: emailLower,
        password: defaultPassword,
        role: 'employee'
      });
      await user.save();
      console.log(`🔐 Auto-provisioned login account for Employee: ${emailLower} with password "Password123"`);
    }

    res.status(201).json(savedEmployee);
  } catch (error) {
    console.error('Add Employee Error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all employees (HR only)
// @route   GET /api/employees
// @access  Private/HR
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ performanceScore: -1 });
    res.status(200).json(employees);
  } catch (error) {
    console.error('Get All Employees Error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get employee by ID
// @route   GET /api/employees/:id
// @access  Private (HR or Owner Employee)
exports.getEmployeeById = async (req, res) => {
  try {
    let employee;
    if (req.params.id === 'me') {
      employee = await Employee.findOne({ email: req.user.email.toLowerCase() });
    } else {
      employee = await Employee.findById(req.params.id);
    }

    if (!employee) {
      return res.status(404).json({ error: 'Employee profile not found.' });
    }

    // Enforce that an employee role can ONLY view their own profile
    if (req.user.role === 'employee' && req.user.email.toLowerCase() !== employee.email.toLowerCase()) {
      return res.status(403).json({ error: 'Access Denied. Employees can only access their own performance analytics.' });
    }

    res.status(200).json(employee);
  } catch (error) {
    console.error('Get Employee By ID Error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update employee profile
// @route   PUT /api/employees/:id
// @access  Private (HR full rights, Employee limited fields)
exports.updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found.' });
    }

    const isHR = req.user.role === 'hr';
    const isOwner = req.user.email.toLowerCase() === employee.email.toLowerCase();

    // Check permissions
    if (!isHR && !isOwner) {
      return res.status(403).json({ error: 'Access Denied. You are not authorized to update this profile.' });
    }

    let updateFields = {};

    if (isHR) {
      // HR can edit all fields
      const {
        name,
        department,
        skills,
        performanceScore,
        experience,
        projects,
        aiFeedback,
        trainingSuggestions,
        ranking
      } = req.body;

      updateFields = {
        name,
        department,
        skills: skills !== undefined ? skills : employee.skills,
        performanceScore: performanceScore !== undefined ? Number(performanceScore) : employee.performanceScore,
        experience: experience !== undefined ? Number(experience) : employee.experience,
        projects: projects !== undefined ? projects : employee.projects,
        aiFeedback: aiFeedback !== undefined ? aiFeedback : employee.aiFeedback,
        trainingSuggestions: trainingSuggestions !== undefined ? trainingSuggestions : employee.trainingSuggestions,
        ranking: ranking !== undefined ? Number(ranking) : employee.ranking
      };

      // If HR changes the employee's name, update the user account name too
      if (name && name !== employee.name) {
        const userAccount = await User.findOne({ email: employee.email });
        if (userAccount) {
          userAccount.name = name;
          await userAccount.save();
        }
      }
    } else {
      // Employee role can only edit limited fields: skills, projects, and maybe basic profile details
      const { skills, projects } = req.body;
      updateFields = {
        skills: skills !== undefined ? skills : employee.skills,
        projects: projects !== undefined ? projects : employee.projects
      };
      console.log(`👤 Employee ${employee.email} updated their skills/projects.`);
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, updateFields, { new: true });
    res.status(200).json(updatedEmployee);

  } catch (error) {
    console.error('Update Employee Error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Delete employee (HR only)
// @route   DELETE /api/employees/:id
// @access  Private/HR
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found.' });
    }

    // Delete employee
    await Employee.findByIdAndDelete(req.params.id);

    // Also delete corresponding login credentials from User model
    const userAccount = await User.findOne({ email: employee.email });
    if (userAccount) {
      await User.findByIdAndDelete(userAccount._id);
      console.log(`🗑️ Removed associated User login credentials for: ${employee.email}`);
    }

    res.status(200).json({ message: 'Employee and associated login records successfully removed.' });
  } catch (error) {
    console.error('Delete Employee Error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Search and filter employees (HR only)
// @route   GET /api/employees/search
// @access  Private/HR
exports.searchAndFilter = async (req, res) => {
  try {
    const { department, skill, experience, performanceScore } = req.query;
    let list = await Employee.find();

    if (department) {
      list = list.filter(e => e.department && e.department.toLowerCase() === department.toLowerCase());
    }

    if (skill) {
      list = list.filter(e => e.skills && e.skills.some(s => s.toLowerCase().includes(skill.toLowerCase())));
    }

    if (experience) {
      list = list.filter(e => (e.experience || 0) >= Number(experience));
    }

    if (performanceScore) {
      list = list.filter(e => (e.performanceScore || 0) >= Number(performanceScore));
    }

    res.status(200).json(list);
  } catch (error) {
    console.error('Search Employees Error:', error.message);
    res.status(500).json({ error: error.message });
  }
};
