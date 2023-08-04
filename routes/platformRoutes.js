const express = require('express');
const router = express.Router();
const platformController = require('../controllers/platformController.js');
const { check } = require('express-validator');
const rateLimit = require('express-rate-limit');
const auth = require("../authMiddleware/authenticate.js");

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

router.post('/create', limiter, [
    // Validation middleware
    check('platform_name').notEmpty().withMessage('Platform name is required'),
    check('platform_description').notEmpty().withMessage('Platform description is required')
    ],
    platformController.createPlatform);

router.get('/fetch', limiter,  [
    // Validation middleware
    check('platform_id').optional().isNumeric().withMessage('Platform ID must be a number')], 
    platformController.getAll);

router.put('/update', limiter,
    [
    check('platform_id').isNumeric().withMessage('Platform ID must be a number'),
    check('platform_name').optional().isString().withMessage('Platform Name must be a string'),
    check('platform_description').optional().isString().withMessage('Platform Description must be a string'),
    check('enabled').optional().isBoolean().withMessage('Enabled option must be a boolean')], 
    platformController.updatePlatform);


router.delete('/delete', limiter, [
        check('platform_id').isNumeric().withMessage('Platform ID must be a number')], 
        platformController.deletePlatform);

module.exports = router;

