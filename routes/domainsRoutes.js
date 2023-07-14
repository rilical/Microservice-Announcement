const express = require('express');
const router = express.Router();
const domainsController = require('../controllers/domainsController.js');
const { check } = require('express-validator');
const rateLimit = require('express-rate-limit');
const auth = require("../authMiddleware/authenticate.js");

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

router.post("/", auth, limiter,[
    check('domain_id').notEmpty().isNumeric().withMessage('ID is required'),
    check('domain_name').notEmpty().isString().withMessage('Name is required'),
    check('platform_id').optional().isNumeric().withMessage('ID must be a integer')]
    ,domainsController.createDomain);


router.post("/fetch", auth, limiter, 
    [check('domain_id').optional().isNumeric().withMessage('Domain ID must be a number')]
    , domainsController.fetchDomain);

router.put("/update", auth, limiter, [
    check('domain_id').isNumeric().withMessage('Domain ID must be a number'),
    check('domain_name').optional().isString().withMessage('Domain Name must be a string'),
    check("platform_id").optional().isNumeric().withMessage("Platform ID must be an integer")],
     domainsController.updateDomain);

router.delete("/delete", auth, limiter,[
    check('domain_id').isNumeric().withMessage('Domain ID must be a number')] 
    ,domainsController.deleteDomain);

module.exports = router;