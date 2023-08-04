const { check, validationResult } = require('express-validator');
const Team = require('../models/team.js'); // updated to 'team.js'
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class TeamController {
    // Fetch all teams
    static async getAll(req, res) {
        try {
            const teams = await Team.findAll();
            return res.json(teams);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'An error occurred while fetching teams.' });
        }
    }

    // Create a team
    static async createTeam(req, res) {
        console.log(req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        try {
            const team = await Team.create(req.body);
            return res.status(201).json(team);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'An error occurred while creating the team.' });
        }
    }

    // Update a team
    static async updateTeam(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        try {
            const team = await Team.findByPk(req.body.id);
            if (!team) return res.status(404).json({ error: 'Team not found.' });
    
            // Check if password is present in the request body
            if (req.body.password) {
                // If password is present, update all fields
                await team.update(req.body);
            } else {
                // If password is not present, update all fields except password
                const { password, ...rest } = req.body;
                await team.update(rest);
            }
    
            return res.json(team);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'An error occurred while updating the team.' });
        }
    }

    // Delete a team
    static async deleteTeam(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const team = await Team.findByPk(req.body.id);
            if (!team) return res.status(404).json({ error: 'Team not found.' });

            await team.destroy();
            return res.status(204).json({ message: 'Team deleted.' });
        } catch(err) {
            console.error(err);
            return res.status(500).json({ error: 'An error occurred while deleting the team.' });
        }
    }

    static async loginUser(req, res) {
        try {
            const { email, password } = req.body;
    
            const user = await Team.findOne({ where: { email: email } });
    
            if (!user) {
                return res.status(400).send('Invalid Email or Password');
            }
    
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(400).send('Invalid Email or Password');
            }
    
            console.log('Secret used for signing:', process.env.JWT_SECRET);  
    
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
            res.cookie('token', token, { httpOnly: true });
            res.status(200).send('Login successful');
        } catch (error) {
            console.error(error);
            res.status(500).send('Something went wrong');
        }
    }
}    

module.exports = TeamController; // updated to TeamController
