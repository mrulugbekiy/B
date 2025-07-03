// server/routes.js
const express = require('express');
const router = express.Router();
const { getData, updateData } = require('./controllers');

router.get('/progress', getData);
router.post('/update', updateData);

module.exports = router; // This is CRUCIAL: exporting the 'router'