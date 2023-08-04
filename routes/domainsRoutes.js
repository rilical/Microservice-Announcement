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

router.post("/create", limiter,[
    check('domain_name').notEmpty().isString().withMessage('Name is required'),
    check('platform_id').optional().isNumeric().withMessage('ID must be a integer')]
    ,domainsController.createDomain);


router.get("/fetch", limiter, domainsController.getAll);

router.put("/update", limiter, [
    check('domain_name').optional().isString().withMessage('Domain Name must be a string'),
    check("platform_id").optional().isNumeric().withMessage("Platform ID must be an integer")],
     domainsController.updateDomain);

router.delete("/delete", limiter,[
    check('domain_id').isNumeric().withMessage('Domain ID must be a number')] 
    ,domainsController.deleteDomain);

module.exports = router;