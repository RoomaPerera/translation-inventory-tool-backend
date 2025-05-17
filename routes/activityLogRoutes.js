const express = require('express');
const router = express.Router();
const { addActivityLog , getActivityLogs } = require('../controllers/activityLogController');
const checkRole = require('../middleware/checkRole'); 


// POST: Add a new activity
router.post('/', addActivityLog);

// GET: Get activity logs
router.get('/', checkRole(['admin', 'developer', 'translator']), getActivityLogs);

module.exports = router;