const { check } = require('express-validator');
const Announcement = require('../models/announcement.js');
const { validationResult } = require('express-validator');

class announcementController {

    static async createAnnouncement(req, res) {
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
        }

    static async fetchAnnouncement(req, res) {
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
            return res.status(204).json({ message: "Announcement deleted" })
          }
    
        } catch(err) {
          console.error(err);
          res.status(500).json({ error: "An error occurred while deleting the announcement" });
        }
      }

}

module.exports = announcementController;




