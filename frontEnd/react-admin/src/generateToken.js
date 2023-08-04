const jwt = require('jsonwebtoken');

const user = {
  id: 8,
  email: 'admin@admin.com',
  accessLevel: 'admin'
};

const secret = 'fy^ZNj*VX<=>?';  // replace with your actual secret key

const token = jwt.sign(user, secret, { expiresIn: '1h' });

console.log(token);
