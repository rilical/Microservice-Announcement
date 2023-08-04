const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Team = require('../models/team.js');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  const row = await Row.findOne({ where: { email } });
  if (!row) return res.status(400).send('User not found');

  // Compare the password
  const validPassword = await bcrypt.compare(password, row.password);
  if (!validPassword) return res.status(400).send('Invalid password');

  // Create a JWT
  const token = jwt.sign({ rowID: row.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  // Set JWT in HttpOnly cookie
  res.cookie('token', token, { httpOnly: true, sameSite: 'strict' });

  res.json({ message: 'Logged in successfully' });
});

module.exports = router;
