const { check } = require('express-validator');
const Announcement = require('../models/announcement.js');
const { validationResult } = require('express-validator');

class announcementController {

  static async createAnnouncement(req, res) {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { announcement_id, ...announcementData } = req.body;  // Extract announcement_id from request body and keep the rest of the data
        const announcement = await Announcement.create(announcementData);  // Pass the rest of the data (without announcement_id) to Announcement.create()
        res.status(201).json(announcement);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while trying to create the announcement' });
    }
}


    static async getAll(req, res) {
      try {
          const announcements = await Announcement.findAll(); // Corrected here
          return res.json(announcements);
      } catch (err) {
          console.error(err);
          return res.status(500).json({ error: 'An error occurred while fetching announcements.' });
      }
    }   

    static async updateAnnouncement(req, res) {
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
      }

    static async deleteAnnouncement(req, res) {
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
            return res.status(204).json({ message: "Announcement deleted" });
          }
    
        } catch(err) {
          console.error(err);
          res.status(500).json({ error: "An error occurred while deleting the announcement" });
        }
      }

}

module.exports = announcementController;
