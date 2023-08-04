require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// Require Database
const db = require('./DB/db');

//Require Models
const { Platform } = require('./models/platform.js'); 
const { Announcement } = require('./models/announcement.js');
const { Domains } = require('./models/domain.js');
const { Team } = require('./models/team.js'); // Require Row Model

// Require Relations
require('./relations/relations');

// Require Routes
const platformRoutes = require('./routes/platformRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const domainRoutes = require('./routes/domainsRoutes');
const teamRoutes = require('./routes/teamRoutes');
const authRoutes = require('./routes/authRoutes');

// Require Controller
const platformController = require('./controllers/platformController');
const announcementController = require('./controllers/announcementController');
const domainsController = require('./controllers/domainsController');
const TeamController = require('./controllers/teamController');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan('dev'));

// Enable CORS Domains
app.use(cors({
  origin: 'http://localhost:5001',
  credentials: true,
}));

// Test database connection
db.sync()
  .then(() => console.log('Databases created!'))

// Import Routes
app.use('/api/v1/platform', platformRoutes);
app.use('/api/v1/announcement', announcementRoutes);
app.use('/api/v1/domain', domainRoutes);
app.use('/api/v1/team', teamRoutes);
app.use('/api/v1/auth', authRoutes);

// Handle invalid route
app.use((req, res, next) => {
  console.log('Request Body: ', req.body);
  console.log('Request Headers: ', req.headers);
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

// Handle other errors
app.use((error, req, res, next) => {
  console.error('An error occurred: ', error.stack);
  res.status(error.status || 500);
  res.json({
    error: error.message
  });
});

// Start LocalHost
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on Port ${port}`);
});
