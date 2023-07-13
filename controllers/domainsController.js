const { check } = require('express-validator');
const Domains = require('../models/domain');
const { validationResult } = require('express-validator');


class domainsController {

    static async createDomain(req, res) {
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
    }

    static async fetchDomain(req, res) {
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
    }

    static async updateDomain(req, res) {
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
    }

    static async deleteDomain(req, res) {
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
    }
}

module.exports = domainsController