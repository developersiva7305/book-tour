const express = require('express');
const router = express.Router();
const User = require('../RegisterModel'); // Adjust the path if your model is elsewhere

// POST /api/register
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword, phone } = req.body;

    // Basic validation
    if (!fullName || !email || !password || !confirmPassword || !phone) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email is already registered.' });
    }

    // Save new user
    const newUser = new User({
      fullName,
      email,
      password,
      confirmPassword,
      phone
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

module.exports = router;