const jwt = require('jsonwebtoken');
require('dotenv').config();
const secretKey = process.env.JWT_SECRET; 

module.exports = function(req, res, next) {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).send('Access Denied');
  }

  try {
    console.log('Token:', token); // <-- add this line
    console.log('Secret key:', secretKey); // <-- add this line

    const verified = jwt.verify(token, secretKey);
    req.user = verified;
    next();
  } catch (err) {
    console.error('Error verifying token:', err); // <-- modify this line
    res.status(400).send('Invalid Token');
  }
};
