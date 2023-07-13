const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const sequelize = require('./DB/db');
const { Platform, Announcement, Domain } = require('./relations/relations');
const platformRoutes = require('./routes/platformRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const domainRoutes = require('./routes/domainRoutes');

const app = express();
sequelize.sync({ force : false });

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1/platform', platformRoutes);
app.use('/api/v1/announcement', announcementRoutes);
app.use('/api/v1/domain', domainRoutes);

module.exports = app;