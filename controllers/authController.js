const jwt = require('jsonwebtoken');
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

app.use(cookieParser());

app.post('/login', async (req, res) => {
    try {
      // Fetch user
      const user = await Row.findOne({ where: { email: req.body.email } });
      
      if (!user) {
        // User not found
        return res.status(400).send('Invalid email or password.');
      }
  
      // Check password
      const validPassword = await bcrypt.compare(req.body.password, user.password);
      
      if (!validPassword) {
        // Invalid password
        return res.status(400).send('Invalid email or password.');
      }
  
      // If authentication successful
      const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET);
  
      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7  // 1 week
      });
  
      res.json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error.');
    }
  });
