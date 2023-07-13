const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController.js');
const { check } = require('express-validator');


router.post("/", [
    check('announcement_id').notEmpty().isNumeric().withMessage('ID is required'),
    check('announcement_title').notEmpty().isString().withMessage('Title is required'),
    check('announcement_body').optional().isString().withMessage('Title must be a string'),
    check('publish_date').notEmpty().isDate().withMessage('Publish date must be a valid date'),
    check('expire_date').notEmpty().isDate().withMessage('End date must be a valid date'),
    check('pinned').optional().isBoolean().withMessage('Pinned must be a boolean'),
    check('published').optional().isBoolean().withMessage('Must be a boolean'),
    check('platform_id').optional().isNumeric().withMessage('Must be a valid ID'),
    ],
    announcementController.createAnnouncement);


router.post("/fetch", [
    check('announcement_id').optional().isNumeric().withMessage('Announcement ID must be a number')],
    announcementController.fetchAnnouncement);

router.put("/update",  [
    check('announcement_id').notEmpty().isNumeric().withMessage('ID is required'),
    check('announcement_title').optional().isString().withMessage('Title is required'),
    check('announcement_body').optional().isString().withMessage('Title must be a string'),
    check('expire_date').optional().isDate().withMessage('End date must be a valid date'),
    check('pinned').optional().isBoolean().withMessage('Pinned must be a boolean'),
    check('published').optional().isBoolean().withMessage('Must be a boolean'),
    check('platform_id').optional().isNumeric().withMessage('Must be a valid ID'), ]
    ,announcementController.updateAnnouncement);


router.delete("/delete", [
    check('announcement_id').isNumeric().withMessage('Announcement ID must be a number')]
    ,announcementController.deleteAnnouncement);

module.exports = router;


