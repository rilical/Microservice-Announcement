require('dotenv').config();
const express = require('express');
const { check, validationResult } = require('express-validation');
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const morgan = require('morgan');




// Require Database
const db = require('./DB/db');

//Require Models

const { Platform } = require('./models/platform.js'); 
const { Announcement } = require('./models/announcement.js');
const { Domains } = require('./models/domain.js');

// Require Relations

require('./relations/relations')

// Require Routes

const platformRoutes = require('./routes/platformRoutes.js');
const announcementRoutes = require('./routes/announcementRoutes.js');
const domainRoutes = require('./routes/domainsRoutes.js');

// Require Controller

const platformController = require('./controllers/platformController.js');
const announcementController = require('./controllers/announcementController.js');
const domainsController = require('./controllers/domainsController.js');

// Middleware

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

//Enable JSON request body for POST and PUT requests
app.use(express.json());

//Enable Morgan for logging
app.use(morgan('dev'));


//Enable CORS Domains
app.use(cors())

//Test database connection
db.sync()
  .then(() => console.log('Databases created!'))

// Import Routes

app.use('/api/v1/platform', platformRoutes);
app.use('/api/v1/announcement', announcementRoutes);
app.use('/api/v1/domain', domainRoutes);

// Handle invalid route
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

// Handle other errors
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
      error: error.message
  });
});

//Start LocalHost

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log('Server is running on Port 3001')
    })
