const express = require('express');
const fs = require('fs');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const { check, validationResult } = require('express-validator');
const morgan = require('morgan');



// Initialize express app & sequelize app
const app = express();
const sequelize = new Sequelize('microservice_announcement', 'root', 'Omar2004', {
    host: 'localhost',
    dialect: 'mysql'
});


//Platform

const Platform = sequelize.define('Platform', {
    platform_id :  {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    platform_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    platform_description: {
        type: DataTypes.STRING,
    },
    enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue : true
    },
    cors_domains: {
        type: DataTypes.STRING,
        defaultValue : null
    }
}, {
    freezeTableName: true,
    timestamps: false,
});

//Announcement

const Announcement = sequelize.define("Announcement", {
    announcement_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    announcement_title : {
        type: DataTypes.STRING,
        allowNull: false
    },
    announcement_body: {
        type: DataTypes.STRING
    },
    record_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    publish_date: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    expire_date: {
        type: DataTypes.DATE,
    },
    pinned: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      published: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      platform_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    });

//Domain

const Domains = sequelize.define('Domains', {
    domain_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    domain_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    platform_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  });

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


 
//Enable CORS
app.use(cors());

//Enable JSON request body for POST and PUT requests
app.use(express.json());

//Enable Morgan for logging
app.use(morgan('dev'));

///////////////////////////////////////////////////////////////////////////////

//PLATFORM /api/v1/platform

//POST Create New Platform
app.post('/api/v1/platform', 
[
    // Validation middleware
    check('platform_id').notEmpty().isNumeric().withMessage("Platform ID is required"),
    check('platform_name').notEmpty().withMessage('Platform name is required'),
    check('platform_description').notEmpty().withMessage('Platform description is required')
    ], 
    
    async (req,res) => {
        // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const platform = await Platform.create(req.body);
        res.status(201).json(platform);
    } catch(err) {
        console.error(err);
        res.status(500).json({error: "An error has occured while trying to create the platform"})
    }
});

//Fetch Platform / Platforms
app.post('/api/v1/platform/fetch', 
  // Validation middleware
  [check('platform_id').optional().isNumeric().withMessage('Platform ID must be a number')],

  async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        if (req.body.platform_id) {
            // Fetch a single platform
            const platform = await Platform.findByPk(req.body.platform_id);
            if (!platform) {
                return res.status(404).json({ error: "Platform not found" });
            } else {
                return res.status(200).json(platform);
            }
        } else {
            // Fetch all platforms
            const platform = await Platform.findAll();
            return res.status(200).json(platform);
        }
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred while fetching the platform(s)" });
    }
});


//Update a platform by its ID.
app.put('/api/v1/platform/update',
  [
    check('platform_id').isNumeric().withMessage('Platform ID must be a number'),
    check('platform_name').optional().isString().withMessage('Platform Name must be a string'),
    check('platform_description').optional().isString().withMessage('Platform Description must be a string'),
    check('enabled').optional().isBoolean().withMessage('Enabled option must be a boolean')
  ],
  async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const platform = await Platform.findByPk(req.body.platform_id);

      if (!platform) {
        return res.status(404).json({ error: "Platform not found" });
      } else {
        const updatedPlatform = await platform.update(req.body);
        return res.status(200).json(updatedPlatform);
      }

    } catch(err) {
      console.error(err);
      res.status(500).json({ error: "An error occurred while updating the platform" });
    }
  });

  
//Delete a platform by its ID.
app.delete('/api/v1/platform/delete',
  [
    check('platform_id').isNumeric().withMessage('Platform ID must be a number')
  ],
  async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const platform = await Platform.findByPk(req.body.platform_id);

      if (!platform) {
        return res.status(404).json({ error: "Platform not found" });
      } else {
        await platform.destroy();
        return res.status(204).json({ message: "Platform deleted" })
      }

    } catch(err) {
      console.error(err);
      res.status(500).json({ error: "An error occurred while deleting the platform" });
    }
  });


///////////////////////////////////////////////////////////////////////////////

//Announcement /api/v1/announcement

//Post Create New Announcement

app.post('/api/v1/announcement', 
  [
    check('announcement_id').notEmpty().isNumeric().withMessage('ID is required'),
    check('announcement_title').notEmpty().isString().withMessage('Title is required'),
    check('announcement_body').optional().isString().withMessage('Title must be a string'),
    check('publish_date').notEmpty().isDate().withMessage('Publish date must be a valid date'),
    check('expire_date').notEmpty().isDate().withMessage('End date must be a valid date'),
    check('pinned').optional().isBoolean().withMessage('Pinned must be a boolean'),
    check('published').optional().isBoolean().withMessage('Must be a boolean'),
    check('platform_id').optional().isNumeric().withMessage('Must be a valid ID'),
  ], 
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
        const announcement = await Announcement.create(req.body);
        res.status(201).json(announcement);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while trying to create the announcement' });
    }
});


//Fetch Announcements / Announcement

app.post('/api/v1/announcement/fetch', 
  // Validation middleware
  [check('announcement_id').optional().isNumeric().withMessage('Announcement ID must be a number')],

  async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        if (req.body.announcement_id) {
            // Fetch a single announcement
            const announcement = await Announcement.findByPk(req.body.announcement_id);
            if (!announcement) {
                return res.status(404).json({ error: "Announcement not found" });
            } else {
                return res.status(200).json(announcement);
            }
        } else {
            // Fetch all announcements
            const announcement = await Announcement.findAll();
            return res.status(200).json(announcement);
        }
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred while fetching the announcement(s)" });
    }
});


//Update a announcement by its ID.
app.put('/api/v1/announcement/update',
  [
    check('announcement_id').isNumeric().withMessage('Platform ID must be a number'),
    check('announcement_title').optional().isString().withMessage('Platform Name must be a string'),
  ],
  async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const announcement = await Announcement.findByPk(req.body.announcement_id);

      if (!announcement) {
        return res.status(404).json({ error: "Announcement not found" });
      } else {
        const updatedAnnouncement = await Announcement.update(req.body, {
          where: {
            announcement_id: req.body.announcement_id
          }
        });
        return res.status(200).json(updatedAnnouncement);
      }

    } catch(err) {
      console.error(err);
      res.status(500).json({ error: "An error occurred while updating the announcement" });
    }
  });


  
//Delete a announcement by its ID.
app.delete('/api/v1/announcement/delete',
  [
    check('announcement_id').isNumeric().withMessage('Announcement ID must be a number')
  ],
  async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const announcement = await Announcement.findByPk(req.body.announcement_id);

      if (!announcement) {
        return res.status(404).json({ error: "Announcement not found" });
      } else {
        await announcement.destroy();
        return res.status(204).json({ message: "Announcement deleted" })
      }

    } catch(err) {
      console.error(err);
      res.status(500).json({ error: "An error occurred while deleting the announcement" });
    }
  });

///////////////////////////////////////////////////////////////////////////////

//DOMAIN /api/v1/domain

//Create New Domain
app.post('/api/v1/domain', 
  [
    check('domain_id').notEmpty().isNumeric().withMessage('ID is required'),
    check('domain_name').notEmpty().isString().withMessage('Name is required'),
    check('platform_id').optional().isNumeric().withMessage('ID must be a integer'),
  ], 
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
        const domain = await Domains.create(req.body);
        res.status(201).json(domain);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while trying to create the domain' });
    }
});

//Fetch Domains / Domain
app.post('/api/v1/domain/fetch', 
  // Validation middleware
  [check('domain_id').optional().isNumeric().withMessage('Domain ID must be a number')],

  async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        if (req.body.domain_id) {
            // Fetch a single announcement
            const domain = await Domains.findByPk(req.body.domain_id);
            if (!domain) {
                return res.status(404).json({ error: "Domain not found" });
            } else {
                return res.status(200).json(domain);
            }
        } else {
            // Fetch all announcements
            const domain = await Domains.findAll();
            return res.status(200).json(domain);
        }
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred while fetching the Domain(s)" });
    }
});

//Update Domain by ID

app.put('/api/v1/domain/update',
  [
    check('domain_id').isNumeric().withMessage('Domain ID must be a number'),
    check('domain_name').optional().isString().withMessage('Domain Name must be a string'),
    check("platform_id").optional().isNumeric().withMessage("Platform ID must be an integer")
  ],
  async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const domain = await Domains.findByPk(req.body.domain_id);

      if (!domain) {
        return res.status(404).json({ error: "Domain not found" });
      } else {
        const updatedDomain = await Domains.update(req.body, {
          where: {
            domain_id: req.body.domain_id
          }
        });
        return res.status(200).json(updatedDomain);
      }

    } catch(err) {
      console.error(err);
      res.status(500).json({ error: "An error occurred while updating the domain" });
    }
  });


//Delete Domain by ID

//Delete a announcement by its ID.
app.delete('/api/v1/domain/delete',
  [
    check('domain_id').isNumeric().withMessage('Domain ID must be a number')
  ],
  async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const domain = await Domains.findByPk(req.body.domain_id);

      if (!domain) {
        return res.status(404).json({ error: "Domain not found" });
      } else {
        await domain.destroy();
        return res.status(204).json({ message: "Domain deleted" })
      }

    } catch(err) {
      console.error(err);
      res.status(500).json({ error: "An error occurred while deleting the Domain" });
    }
  });

///////////////////////////////////////////////////////////////////////////////



//Start LocalHost

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log('Server is running on Port 3001')
    })
