const User = require('../models/User');
const bcrypt = require('bcrypt');

// Helper function to validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(email);
};

// Helper function to validate password strength
const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    // Trim and format name and email to lowercase
    const formattedName = name.trim().toLowerCase();
    const formattedEmail = email.trim().toLowerCase();

    // Validation checks
    if (!formattedName || !formattedEmail || !password) {
      const error = new Error('All fields are required.');
      error.statusCode = 400;
      throw error;
    }

    if (formattedName.length < 3) {
      const error = new Error('Name must be at least 3 characters long.');
      error.statusCode = 400;
      throw error;
    }

    // Email validation
    if (!isValidEmail(formattedEmail)) {
      const error = new Error('Invalid email format.');
      error.statusCode = 400;
      throw error;
    }

    // Password validation
    if (!isValidPassword(password)) {
      const error = new Error('Password must be at least 8 characters long, contain at least one letter, one number, and one special character.');
      error.statusCode = 400;
      throw error;
    }

    // Check if the email is already registered
    const foundUser = await User.findOne({ email: formattedEmail });
    if (foundUser) {
      const error = new Error('This email is already registered.');
      error.statusCode = 400;
      throw error;
    }

    // Hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Creating a new user instance
    const newUser = new User({
      name: formattedName,
      email: formattedEmail,
      password: hashedPassword,
    });

    // Saving the new user to the database
    const savedUser = await newUser.save();

    // Responding with a success message
    res.status(200).json({ message: 'User registered successfully', status: true });

  } catch (error) {
    // Handling errors and passing to error-handling middleware
    next(error);
  }
};

module.exports = register;
