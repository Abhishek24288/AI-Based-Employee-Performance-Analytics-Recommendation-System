const User = require('../models/User');
const Employee = require('../models/Employee');
const jwt = require('jsonwebtoken');

// Helper to sign JWT
const signToken = (id) => {
  const secret = process.env.JWT_SECRET || 'guruji_ai_secret_key_12345';
  return jwt.sign({ id }, secret, {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please provide name, email, and password.' });
    }

    const emailLower = email.toLowerCase();

    // Check if user already exists
    const userExists = await User.findOne({ email: emailLower });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists with this email address.' });
    }

    // Auto-promote first user to HR role for testing and setup convenience
    const allUsers = await User.find();
    let finalRole = role || 'employee';
    if (allUsers.length === 0) {
      finalRole = 'hr';
      console.log('👑 First user created. Automatically assigned HR/Admin role.');
    }

    // Create user
    const user = new User({
      name,
      email: emailLower,
      password,
      role: finalRole
    });

    const savedUser = await user.save();

    // If the registered user is an employee, create a stub employee profile automatically!
    if (finalRole === 'employee') {
      const existingEmployee = await Employee.findOne({ email: emailLower });
      if (!existingEmployee) {
        const newEmp = new Employee({
          employeeId: 'EMP_' + Math.random().toString(36).substr(2, 6).toUpperCase(),
          name,
          email: emailLower,
          department: 'Engineering', // default stub department
          skills: [],
          performanceScore: 70, // base rating
          experience: 1,
          projects: []
        });
        await newEmp.save();
        console.log(`👤 Automatically seeded employee profile for: ${emailLower}`);
      }
    }

    // Generate JWT
    const token = signToken(savedUser._id);

    res.status(201).json({
      token,
      user: {
        _id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role
      }
    });

  } catch (error) {
    console.error('Signup Error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password.' });
    }

    const emailLower = email.toLowerCase();

    // Find user
    const user = await User.findOne({ email: emailLower });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Verify password
    const isMatch = await User.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Generate JWT
    const token = signToken(user._id);

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    });
  } catch (error) {
    console.error('getMe Error:', error.message);
    res.status(500).json({ error: error.message });
  }
};
