const { check } = require('express-validation');
const Platform = require("../models/platform.js");
const { validationResult } = require('express-validator');


class PlatformController {
    static async createPlatform(req, res) {
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
    }

    static async fetchPlatform(req, res) {
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
    }

    static async updatePlatform(req, res) {
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
      }

    static async deletePlatform(req, res) {
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
    }
}

module.exports = PlatformController;
