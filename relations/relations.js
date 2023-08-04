
const sequelize = require('../DB/db');
const Platform = require("../models/platform.js");
const Announcement = require("../models/announcement.js");
const Domains = require("../models/domain.js");
const Team = require("../models/team.js");

// Define relationship between Platforms and Announcements
Platform.hasMany(Announcement, {
    foreignKey: 'platform_id',
    as: 'announcements'
  });
  Announcement.belongsTo(Platform, { foreignKey: 'platform_id' });
  
  // Define relationship between Platforms and Domains
  Platform.hasMany(Domains, {
    foreignKey: 'platform_id',
    as: 'domains'
  });
  Domains.belongsTo(Platform, { foreignKey: 'platform_id' });

  sequelize.sync({ force : false });

module.exports = { Platform, Announcement, Domains, Team};

