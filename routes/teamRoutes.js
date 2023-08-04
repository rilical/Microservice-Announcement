const express = require('express');
const router = express.Router();
const TeamController = require('../controllers/teamController.js');
const { check } = require('express-validator');
const rateLimit = require('express-rate-limit');
const auth = require("../authMiddleware/authenticate.js");

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

router.post('/create',
  [
    check('firstName').not().isEmpty().withMessage('First name is required'),
    check('lastName').not().isEmpty().withMessage('Last name is required'),
    check('email').isEmail().withMessage('Email is invalid'),
    check('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters'),
    check('accessLevel').not().isEmpty().withMessage('Access level is required'),
  ],
  TeamController.createTeam);
  

router.post('/login', TeamController.loginUser);


router.get("/fetch", limiter, TeamController.getAll);

router.put('/update', [
  check('id').isInt(),
  check('firstName').optional().isLength({ min: 2 }),
  check('lastName').optional().isLength({ min: 2 }),
  check('email').optional().isEmail(),
  check('password').optional().isLength({ min: 8 }),
  check('accessLevel').optional().isIn(['admin', 'user'])
], TeamController.updateTeam);




router.delete("/delete",limiter, [
    check('id').isNumeric().withMessage('Row ID must be a number')
], TeamController.deleteTeam);

module.exports = router;
